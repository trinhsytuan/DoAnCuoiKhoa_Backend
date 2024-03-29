const { handleCreate, handleUpdate, handleDelete } = require("../../config/baseChung");
const { STATUS_COMMENT } = require("../../constant/constant");
const { commentModel } = require("../../model/comment");

const createComment = async (req, res) => {
    const {contentComment, postId} = req.body;
    const userComment = req.user._id;
    const response = await handleCreate(commentModel, {contentComment, postId, userComment, status: STATUS_COMMENT.PENDING});
    res.status(200).json(response);
}
const updateComment = async(req, res) => {
    const {id} = req.params;
    const response = await handleUpdate(commentModel, id, req.body);
    res.status(200).json(response);
};
const deleteComment = async(req, res) => {
    const {id} = req.params;
    const response = await handleDelete(commentModel, id);
    res.status(200).json(response);
}
const getComment = async(req, res) => {
    const {id} = req.params;
    const response = await commentModel.find({postId: id}).populate("userComment");
    res.status(200).json(response); 
}
module.exports = { createComment, updateComment, deleteComment, getComment };
