const {recordNewUpdate} = require("../constant/constant");
const handleCreate = (model, data) => {
  return model.create(data);
};
const handleDelete = (model, id) => {
  return model.findOneAndDelete({ _id:id });
};
const handleUpdate = (model, id, data) => {
  return model.findOneAndUpdate({_id: id}, {$set: data}, recordNewUpdate)
}
const handleUpdatePopulate = (model, id, data, path, modelPath) => {
  return model.findOneAndUpdate({_id: id}, {$set: data}, recordNewUpdate).populate({ path, model: modelPath });
}
module.exports = { handleCreate, handleDelete, handleUpdate, handleUpdatePopulate };
