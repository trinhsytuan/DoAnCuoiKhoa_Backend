const crypto = require("crypto");
const fs = require("fs");
const { handleCreate } = require("../../config/baseChung");
const { fileModelSchema } = require("../../model/fileModel");
const { EncryptionBGW } = require("../../Crypto/process");
const path = require("path");
const { imageUpload } = require("../../utils/uploadImage");
const util = require("util");
const { convertStringToByte, unlinkFile } = require("../../utils/utils");
require("dotenv").config();
const uploadMiddleware = util.promisify(imageUpload.single("file"));
const createNewFile = async (req, res) => {
  await uploadMiddleware(req, res);
  const FileNameOrigin = req.file.filename;
  const idUser = req.decodeToken.idCrypto;
  const fileNameMulter = req.file.filename;
  const absoluteFilePath = path.join(
    __dirname,
    "../../../",
    "uploads",
    fileNameMulter
  );
  const cipherFile = fs.readFileSync(absoluteFilePath);
  const khoak = await EncryptionBGW(idUser + 1, async (key) => {
    const keyarr = key.split("\n");
    const iv = Buffer.from(process.env.IV_CIPHER, 'hex');
    const keyBuffer = await convertStringToByte(keyarr[0]);
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
    const encryptedData = Buffer.concat([
      cipher.update(cipherFile),
      cipher.final(),
    ]);
    const ToFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/cipher",
        FileNameOrigin
      );
    fs.writeFileSync(ToFilePath, encryptedData);
    unlinkFile(absoluteFilePath);
    //const response = await handleCreate(fileModelSchema, {});
    //res.status(200).json(response);
  });
};
const processFile = (stdout) => {
  console.log(stdout);
};
const downloadInFile = (req, res) => {
  res.setHeader(
    "Content-disposition",
    "attachment; filename=1705326597035-962138459-gpt.jpeg"
  );
  res.setHeader("Content-type", "application/octet-stream");
  const fileStream = fs.createReadStream(
    "/Users/tuan/Documents/DoAnCuoiKhoa_Backend/uploads/1705326597035-962138459-gpt.jpeg"
  );
  fileStream.pipe(res);
};

module.exports = { createNewFile, downloadInFile };
