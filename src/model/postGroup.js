const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const requestJoin = new mongoose.Schema(
  {
    content: { type: String, required: true },
    idGroup: {
      ref: "group",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: { type: String },
    attachment: [
      {
        ref: "files",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    type: {type: String, require: true},
    tRandom: { type: String },
    C1: { type: String },
    C2: { type: String },
    livestreamName: {type: String},
  },
  { timestamps: true }
);
requestJoin.plugin(mongoosePaginate);
const requestJoinModel = mongoose.model("group", requestJoin);
module.exports = { requestJoinModel };
