const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const groupSchema = new mongoose.Schema(
  {
    nameGroup: { type: String, required: true },
    member: [{
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
    }],    
    userCreator: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
groupSchema.plugin(mongoosePaginate);
const groupModel = mongoose.model("groupssss", groupSchema);
module.exports = { groupModel };
