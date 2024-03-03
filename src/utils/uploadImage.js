const multer = require("multer");
const { makeid } = require("./utils");

// Thiết lập lưu trữ cho tệp tải lên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = makeid(30);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + fileName);
  },
});

const imageUpload = multer({ storage: storage });
module.exports = {
  imageUpload,
};
