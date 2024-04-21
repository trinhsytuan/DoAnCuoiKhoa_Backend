const { ReEncryptionBGW } = require("../../Crypto/process");
const { handleCreate, handleUpdate } = require("../../config/baseChung");
const { recordNewUpdate, TYPE_POST } = require("../../constant/constant");
const { fileModelSchema } = require("../../model/fileModel");
const { groupModel } = require("../../model/groupModel");
const { postModel } = require("../../model/postGroup");

const createGroup = async (req, res) => {
  const idUser = req.decodeToken._id;
  const { nameGroup, userCreator } = req.body;
  const response = await handleCreate(groupModel, {
    nameGroup,
    userCreator: [idUser],
    member: idUser,
  });
  return res.status(200).json(response);
};
const leaveGroup = async (req, res) => {
  const idUser = req.decodeToken._id;
  const { id } = req.params;
  const response = await groupModel.findOneAndUpdate(
    { _id: id },
    { $pull: { member: idUser } },
    { new: true }
  );
  return res.status(200).json(response);
};
const kichOutGroup = async (req, res) => {
  const { idUser } = req.body;
  const { id } = req.params;
  const response = await groupModel.findOneAndUpdate(
    { _id: id },
    { $pull: { member: idUser } },
    { new: true }
  );
  return res.status(200).json(response);
};
const addMember = async (req, res) => {
  const { idUser } = req.body;
  const { id } = req.params;
  const response = await groupModel.findOneAndUpdate(
    { _id: id, member: { $ne: idUser } },
    { $push: { member: idUser } },
    { new: true }
  );
  return res.status(200).json(response);
};
const editMember = async (req, res) => {
  const { id } = req.params;
  const response = await groupModel
    .findOneAndUpdate({ _id: id }, { member: req.body.member }, recordNewUpdate)
    .populate("member")
    .lean();
  res.status(200).json(response);
  const getAllFilePost = await fileModelSchema.find({ category: id }).lean();
  let tepgiaima = "";
  for (let i = 0; i < response?.member?.length; i++) {
    if (i == 0) tepgiaima += response?.member[i].idCrypto + 1;
    else tepgiaima += " " + (response?.member[i].idCrypto + 1);
  }
  for (let i = 0; i < getAllFilePost.length; i++) {
    ReEncryptionBGW(getAllFilePost[i]?.tRandom, tepgiaima, async (key) => {
      const keyarr = key.split("\n");
      const response = await fileModelSchema.findOneAndUpdate(
        { _id: getAllFilePost[i]?._id.toString() },
        {
          userDecription: req?.body?.member,
          C1: keyarr[0],
          C2: keyarr[1],
        },
        recordNewUpdate
      );
    });
    
  }
  const postShema = await postModel.find({type: TYPE_POST.LIVE});
  for (let i = 0; i < postShema.length; i++) {
    ReEncryptionBGW(postShema[i]?.tRandom, tepgiaima, async (key) => {
      const keyarr = key.split("\n");
      const response = await postModel.findOneAndUpdate(
        { _id: postShema[i]?._id.toString() },
        {
          C1: keyarr[0],
          C2: keyarr[1],
        },
        recordNewUpdate
      );
    });

  }
};
const getAllGroupJoin = async (req, res) => {
  const response = await groupModel.find({ member: req.decodeToken._id });
  return res.status(200).json(response);
};
const getAllMember = (groupId) => {
  return groupModel.findOne({ _id: groupId }).populate("member");
};
module.exports = {
  createGroup,
  editMember,
  leaveGroup,
  kichOutGroup,
  getAllMember,
  getAllGroupJoin,
};
