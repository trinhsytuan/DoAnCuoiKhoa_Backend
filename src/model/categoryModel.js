const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const categoryModel = new mongoose.Schema(
  {
    name: { type: String, required: true},
    idUser: {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
    },
  
    
  },
  { timestamps: true }
);
categoryModel.plugin(mongoosePaginate);
const categoryModels = mongoose.model("category", categoryModel);
module.exports = { categoryModels };
