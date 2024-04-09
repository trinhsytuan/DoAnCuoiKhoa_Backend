const md5 = require("md5");
const { createLiveStream } = require("../../livestream/livestream");
const { makeid } = require("../../utils/utils");
const { ReEncryptionBGW, EncryptionBGW } = require("../../Crypto/process");
const { handleCreate, handleUpdate, handleDelete } = require("../../config/baseChung");
const { postModel } = require("../../model/postGroup");
const { TYPE_MEMBER, TYPE_POST, STATUS_COMMENT } = require("../../constant/constant");
const { getAllMember } = require("../group/groupController");

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
      khoak: keyarr[0]
    };
    const keyLivestream = await genKey(newObj?.khoak);
    createLiveStream(keyLivestream.livestreamKey);
    const responeDb = await handleCreate(postModel, {
      idGroup,
      status: STATUS_COMMENT.ACCEPT,
      userOwn: id,
      tRandom: keyarr[3],
      C1: keyarr[1],
      C2: keyarr[2],
      livestreamName: keyLivestream.streamName,
    })
    return res.status(200).json({...responeDb?._doc, ...keyLivestream});
  });
};
const addPost = async (req, res) => {
  const { content, idGroup, attachment } = req.body;
  console.log(req.body);
  const id = req.decodeToken._id;
  const response = await handleCreate(postModel, {
    content,
    idGroup,
    status: STATUS_COMMENT.ACCEPT,
    attachment,
    userOwn: id,
    type: TYPE_POST.POST,
  });
  return res.status(200).json(response);
};
const editPost = async (req, res) => {
  const { content, attachment } = req.body;
  const { id } = req.query;
  const response = await handleUpdate(postModel, id, {
    content,
    attachment,
  });
  const createReCrypto = ReEncryptionBGW("tRandom", "tepgiaima", async (key) => {
    const keyarr = key.split("\n");
    return {
      C1: keyarr[0],
      C2: keyarr[1],
    };
  });
  
  return res.status(200).json(response);
};
const deletePost = async(req, res) => {
  const {id} = req.query;
  const response = await handleDelete(postModel, id);
  return res.status(200).json(response);
}
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
  };
};


module.exports = { addPost, editPost, getKeyLivestream, deletePost };
