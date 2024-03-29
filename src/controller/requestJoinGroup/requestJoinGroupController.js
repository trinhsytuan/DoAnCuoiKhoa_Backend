const { TYPE_MEMBER } = require("../../constant/constant");
const { groupModel } = require("../../model/groupModel");
const { requestJoinModel } = require("../../model/requestJoin");

const getGroupById = async (req, res) => {
  const { id } = req.params;
  const response = await requestJoinModel.find({ idGroup: id });
  return res.status(200).json(response);
};
const createJoinGroup = async (req, res) => {
  try {
    const { idGroup } = req.body;
    const id = req.decodeToken._id;
    const response = await requestJoinModel.create({
      userRequest: id,
      idGroup,
      status: "pending",
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({ message: e.toString(), status: false });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const idUser = req.decodeToken._id;
  const { status } = req.body;
  const response = await requestJoinModel.findOneAndUpdate(
    { _id: id },
    { status },
    { new: true }
  );
  if (status === TYPE_MEMBER.ACCEPT) {
    const responseGroup = await groupModel.findOneAndUpdate(
      {
        _id: response?.idGroup,
        member: { $ne: idUser },
      },
      {
        $addToSet: { member: idUser },
      },
      { new: true }
    );
    if (!responseGroup)
      return res
        .status(400)
        .json({ message: "Bạn đã ở trong nhóm này rồi!", status: false });
    return res.status(200).json({ response, responseGroup });
  }
  return res.status(200).json(response);
};
const deleteRequest = async (req, res) => {
  const { id } = req.params;
  const response = await requestJoinModel.findOneAndDelete({ _id: id });
  return res.status(200).json(response);
};
module.exports = { getGroupById, createJoinGroup, updateStatus, deleteRequest };
