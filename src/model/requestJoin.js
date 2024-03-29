const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const requestJoin = new mongoose.Schema(
  {
    userRequest: { type: String, required: true, unique: true},
    idGroup: {
        ref: "group",
        type: mongoose.Schema.Types.ObjectId,
        unique: true
      },
    status: { type: String },
  },
  { timestamps: true }
);
requestJoin.plugin(mongoosePaginate);
const requestJoinModel = mongoose.model("requestJoin", requestJoin);
module.exports = { requestJoinModel};
