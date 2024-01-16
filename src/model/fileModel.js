const {default: mongoose} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {FILETYPE_ROLE} = require("../constant/constant");
const fileModel = new mongoose.Schema(
    {
        fileName: {type: String, required: true},
        userOwn: {
            ref: "users",
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        tRandom: {type: Number},
        C1: {type: String},
        C2: {type: String},
        category: {
            ref: "category",
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        fileType: {
            type: String,
            enum: [FILETYPE_ROLE.FILE, FILETYPE_ROLE.LIVESTREAM, FILETYPE_ROLE.VIDEO],
            required: true
        }
    },
    {timestamps: true}
);
fileModel.plugin(mongoosePaginate);
const fileModelSchema = mongoose.model("files", fileModel);
module.exports = {fileModelSchema};
