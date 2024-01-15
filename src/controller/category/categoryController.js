const { handleCreate, handleDelete } = require("../../config/baseChung");
const { categoryModels } = require("../../model/categoryModel");

const insertOneCategory = async (req, res) => {
  const data = req.body;

  const response = await handleCreate(categoryModels, {
    ...data,
    idUser: req.decodeToken._id,
  });
  return res.status(200).json(response);
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const response = await handleDelete(categoryModels, id);
  return res.status(200).json(response);
};
module.exports = { insertOneCategory, deleteCategory };
