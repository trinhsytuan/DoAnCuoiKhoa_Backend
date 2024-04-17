const md5 = require("md5");
const { createLiveStream } = require("../../livestream/livestream");
const { makeid, cloneObj } = require("../../utils/utils");
const {
  ReEncryptionBGW,
  EncryptionBGW,
  DecryptionBGW,
} = require("../../Crypto/process");
const {
  handleCreate,
  handleUpdate,
  handleDelete,
} = require("../../config/baseChung");
const { postModel } = require("../../model/postGroup");
const {
  TYPE_MEMBER,
  TYPE_POST,
  STATUS_COMMENT,
} = require("../../constant/constant");
const { getAllMember } = require("../group/groupController");
const { fileModelSchema, fileSchema } = require("../../model/fileModel");
const { groupModel } = require("../../model/groupModel");
const { privateKey } = require("../../constant/privateKey");
const { commentModel } = require("../../model/comment");
const { Mongoose } = require("mongoose");

String.prototype.format = function () {
  let formatted = this;
  for (let i = 0; i < arguments.length; i++) {
    const regex = new RegExp("\\{" + i + "\\}", "gm");
    formatted = formatted.replace(regex, arguments[i]);
  }
  return formatted;
};
const getKeyLivestream = async (req, res) => {
  const id = req.decodeToken._id;
  const { idGroup } = req.body;

  const getMemberOfGroup = getAllMember(idGroup);
  let tepgiaima = "";
  for (let i = 0; i < getMemberOfGroup?.member?.length; i++) {
    if (i == 0) tepgiaima += getMemberOfGroup?.member[i].idCrypto + 1;
    else tepgiaima += " " + (getMemberOfGroup?.member[i].idCrypto + 1);
  }
  const getKeyFromBGW = await EncryptionBGW(tepgiaima, async (key) => {
    const keyarr = key.split("\n");
    const newObj = {
      tRandom: keyarr[3],
      C1: keyarr[1],
      C2: keyarr[2],
      khoak: keyarr[0],
    };
    const keyLivestream = await genKey(newObj?.khoak);
    createLiveStream(keyLivestream.livestreamKey);
    const responeDb = await handleCreate(postModel, {
      idGroup,
      status: STATUS_COMMENT.ACCEPT,
      userOwn: id,
      type: TYPE_POST.LIVE,
      tRandom: keyarr[3],
      C1: keyarr[1],
      C2: keyarr[2],
      livestreamObjOptions: {streamName: keyLivestream.streamName, expirationTimestamp: keyLivestream.expirationTimestamp},
    });
    return res.status(200).json({ ...responeDb?._doc, ...keyLivestream });
  });
};
const addPost = async (req, res) => {
  const { content, idGroup, attachment } = req.body;
  const id = req.decodeToken._id;
  const response = await handleCreate(postModel, {
    content,
    idGroup,
    status: STATUS_COMMENT.ACCEPT,
    attachment,
    userOwn: id,
    type: TYPE_POST.POST,
  });
  const responseUpdate = await handleUpdate(postModel, response?._id, {
    attachment: response?._id,
    comment: response?._id,
  });
  res.status(200).json(responseUpdate);
};
const editPost = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const response = await handleUpdate(postModel, id, {
    content,
  });
  return res.status(200).json(response);
};
const deletePost = async (req, res) => {
  
  const { id } = req.params;
  const response = await handleDelete(postModel, id);
  return res.status(200).json(response);
};
const genKey = async (key) => {
  const idStream = makeid(20);
  const initialDate = new Date();

  const expirationDate = new Date(
    initialDate.getFullYear() + 1,
    initialDate.getMonth(),
    initialDate.getDate(),
    initialDate.getHours(),
    initialDate.getMinutes(),
    initialDate.getSeconds()
  );

  const expirationTimestamp = expirationDate.getTime() / 1000;
  const idStreamKey = "{0}-{1}-{2}".format(
    idStream,
    expirationTimestamp,
    md5(key)
  );
  return {
    livestreamKey: idStreamKey,
    streamName: idStream,
    expirationTimestamp,
  };
};

const getPostByCategory = async (req, res) => {
  const { id } = req.params;
  let responsePost = await postModel
    .find({ idGroup: id })
    .populate({ path: "userOwn" }).sort({createdAt: -1})
  let newPost = cloneObj(responsePost);
  for(let i = 0; i < newPost.length;i++) {
    newPost[i].attachment = await fileModelSchema.find({postId: responsePost[i]?._id});
    newPost[i].comment = await commentModel.find({postId: responsePost[i]?._id}).populate("userComment");
  }
  return res.status(200).json(newPost);
};

const getLivestream = async (req, res) => {
  const idCrypto = req.decodeToken.idCrypto;
  const idUser = req.decodeToken._id;
  const { id } = req.params;
  const infoLivestream = await postModel.findOne({ _id: id });
  const userGroup = await groupModel.find({ _id: infoLivestream.idGroup });
  let tepgiaima = "";
  for (let i = 0; i < userGroup?.member?.length; i++) {
    if (i == 0) tepgiaima += userGroup?.member[i]?.idCrypto + 1;
    else tepgiaima += "," + (userGroup?.member[i]?.idCrypto + 1);
  }
  const privateKeys = privateKey[idCrypto + 1];
  DecryptionBGW(
    idCrypto,
    id,
    privateKeys,
    infoLivestream.C1,
    infoLivestream.C2,
    async (e) => {
      res.status(200).json({streamKey: md5(e)});
    }
  );
};
module.exports = {
  addPost,
  editPost,
  getKeyLivestream,
  deletePost,
  getPostByCategory,
  getLivestream,
};
