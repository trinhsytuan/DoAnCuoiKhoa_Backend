const handleCreate = (model, data) => {
  return model.create(data);
};
const handleDelete = (model, id) => {
  return model.deleteOne({ id });
};
module.exports = { handleCreate, handleDelete };
