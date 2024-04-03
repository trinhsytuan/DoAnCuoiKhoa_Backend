const { handleCreate, handleUpdate } = require("../../config/baseChung");
const { groupModel } = require("../../model/groupModel");

const createGroup = async(req, res) => {
    const idUser = req.decodeToken._id;
    const {nameGroup, userCreator} = req.body;
    const response = await handleCreate(groupModel, {
        nameGroup,
        userCreator: idUser,
        member: [idUser],
    });
    return res.status(200).json(response);
}
const leaveGroup = async(req, res) => {
    const idUser = req.decodeToken._id;
    const {id} = req.params;
    const response = await groupModel.findOneAndUpdate({_id: id}, {$pull: {member: idUser}}, {new: true});
    return res.status(200).json(response);
}
const kichOutGroup = async(req, res) => {
    const {idUser} = req.body;
    const {id} = req.params;
    const response = await groupModel.findOneAndUpdate({_id: id}, {$pull: {member: idUser}}, {new: true});
    return res.status(200).json(response);
}
const addMember = async(req, res) => {
    const {idUser} = req.body;
    const {id} = req.params;
    const response = await groupModel.findOneAndUpdate({_id: id, member: { $ne: idUser },}, {$push: {member: idUser}}, {new: true});
    return res.status(200).json(response);
}
const editMember = async(req,res) => {
    const {id} = req.params;
    const response = await handleUpdate(groupModel, id, req.body);
    return res.status(200).json(response);
}
const getAllGroupJoin = async(req, res) => {
    const response = await groupModel.find({member: req.decodeToken._id});
    return res.status(200).json(response);
}
const getAllMember = (groupId) => {
    return groupModel.findOne({_id: groupId}).populate("member");
}
module.exports = { createGroup, editMember, leaveGroup, kichOutGroup, getAllMember, getAllGroupJoin };