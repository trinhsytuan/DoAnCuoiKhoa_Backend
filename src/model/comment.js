const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const commentSchema = new mongoose.Schema(
  {
    contentComment: { type: String, required: true },
    postId: {
      ref: "posts",
      type: mongoose.Schema.Types.ObjectId,
    },
    userComment: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: { type: String },
  },
  { timestamps: true }
);
commentSchema.plugin(mongoosePaginate);
const commentModel = mongoose.model("comment", commentSchema);
module.exports = { commentModel };
