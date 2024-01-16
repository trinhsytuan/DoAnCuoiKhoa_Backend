const {handleCreate, handleDelete, handleUpdate} = require("../../config/baseChung");
const {categoryModels} = require("../../model/categoryModel");

const insertOneCategory = async (req, res) => {
    try {
        const data = req.body;

        const response = await handleCreate(categoryModels, {
            ...data,
            idUser: req.decodeToken._id,
        });
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.toString()
        })
    }
};

const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await handleDelete(categoryModels, id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.toString()
        })
    }
};
const editCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await handleUpdate(categoryModels, id, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.toString()
        })
    }
}
module.exports = {insertOneCategory, deleteCategory, editCategory};
