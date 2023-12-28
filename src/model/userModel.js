const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const userModel = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    idCrypto: { type: Number, required: true },
    roleUser: { type: String },
    privateKey: { type: String },
  },
  { timestamps: true }
);
userModel.plugin(mongoosePaginate);
const userModelSchema = mongoose.model("users", userModel);
module.exports = { userModelSchema };
