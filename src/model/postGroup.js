const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const postSchema = new mongoose.Schema(
  {
    content: { type: String},
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
    comment: [
      {
        ref: "comment",
        type: mongoose.Schema.Types.ObjectId,
      }
    ],
    userOwn: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
      required: true 
    },
    type: {type: String, require: true},
    tRandom: { type: String },
    C1: { type: String },
    C2: { type: String },
    livestreamName: {type: String},
  },
  { timestamps: true }
);
postSchema.plugin(mongoosePaginate);
const postModel = mongoose.model("posts", postSchema);
module.exports = { postModel };
