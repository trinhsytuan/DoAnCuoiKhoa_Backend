const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { FILETYPE_ROLE } = require("../constant/constant");
const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    userOwn: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    postId: {
      ref: "posts",
      type: mongoose.Schema.Types.ObjectId,
    },
    tRandom: { type: String },
    C1: { type: String },
    C2: { type: String },
    originalFilename: {type: String, require: true},
    userDecription: [
      { ref: "users", type: mongoose.Schema.Types.ObjectId, required: true },
    ],
    category: {
      ref: "category",
      type: mongoose.Schema.Types.ObjectId
    },
    fileType: {
      type: String,
      enum: [FILETYPE_ROLE.FILE, FILETYPE_ROLE.LIVESTREAM, FILETYPE_ROLE.VIDEO, FILETYPE_ROLE.IMAGE],
      required: true,
    },
    postId: {
      ref: "posts",
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

fileSchema.plugin(mongoosePaginate);
const fileModelSchema = mongoose.model("files", fileSchema);
module.exports = { fileModelSchema, fileSchema };
