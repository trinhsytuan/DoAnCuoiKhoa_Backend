const crypto = require("crypto");
const fs = require("fs");
const {
  handleCreate,
  handleUpdate,
  handleDelete,
  handleUpdatePopulate,
} = require("../../config/baseChung");
const { fileModelSchema } = require("../../model/fileModel");
const {
  EncryptionBGW,
  DecryptionBGW,
  ReEncryptionBGW,
} = require("../../Crypto/process");
const path = require("path");
const { imageUpload } = require("../../utils/uploadImage");
const util = require("util");
const {
  convertStringToByte,
  unlinkFile,
  searchLike,
} = require("../../utils/utils");
const { FILETYPE_ROLE, recordNewUpdate } = require("../../constant/constant");
const { privateKey } = require("../../constant/privateKey");
require("dotenv").config();
const uploadMiddleware = util.promisify(imageUpload.single("file"));
const findFileByCategory = async (req, res) => {
  const { category, file_name, share } = req.query;
  try {
    let search = {};
    if (category) search.category = category;
    if (file_name) search.originalFilename = searchLike({ like: file_name });
    if (req?.decodeToken?._id && !share) search.userOwn = req.decodeToken._id;
    else if (share) {
      search.userDecription = share;
      search.userOwn = { $ne: share };
    }
    const response = await fileModelSchema
      .find(search)
      .populate({ path: "category", model: "category" });
    res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.toString(),
      success: false,
    });
  }
};
const createNewFile = async (req, res) => {
  await uploadMiddleware(req, res);
  let dataParse = null;
  if (req?.body?.category && req?.body?.category != "null") {
    dataParse = req?.body?.category;
  }
  const jsonParse = req?.body?.jsonData ? JSON.parse(req.body?.jsonData) : null;
  let postId = jsonParse?.postId;
  const FileNameOrigin = req.file.filename;
  const fileNameSave = req?.body?.fileName || jsonParse?.originalFilename;
  const idUser = req.decodeToken.idCrypto;
  const absoluteFilePath = path.join(
    __dirname,
    "../../../",
    "uploads",
    FileNameOrigin
  );
  const cipherFile = fs.readFileSync(absoluteFilePath);
  const khoak = await EncryptionBGW(idUser + 1, async (key) => {
    const keyarr = key.split("\n");
    const iv = Buffer.from(process.env.IV_CIPHER, "hex");
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
    let objPush = {
      fileName: FileNameOrigin,
      userOwn: req.decodeToken._id,
      tRandom: keyarr[3],
      C1: keyarr[1],
      C2: keyarr[2],
      userDecription: [req.decodeToken._id],
      fileType: FILETYPE_ROLE.FILE,
      originalFilename: fileNameSave,
      postId,
    };
    if (dataParse) objPush.category = dataParse;
    const response = await handleCreate(fileModelSchema, objPush);
    res.status(200).json(response);
  });
};
const shareFile = async (req, res) => {
  const { id } = req.params;
  const { listUser } = req.body;
  try {
    const response = await handleUpdatePopulate(
      fileModelSchema,
      id,
      { userDecription: listUser },
      "userDecription",
      "users"
    );
    let tepgiaima = "";
    for (let i = 0; i < response?.userDecription?.length; i++) {
      if (i == 0) tepgiaima += response?.userDecription[i].idCrypto + 1;
      else tepgiaima += " " + (response?.userDecription[i].idCrypto + 1);
    }
    ReEncryptionBGW(response.tRandom, tepgiaima, async (key) => {
      const keyarr = key.split("\n");
      const resUpdate = await handleUpdate(fileModelSchema, id, {
        userDecription: listUser,
        C1: keyarr[0],
        C2: keyarr[1],
      });
      return res.status(200).json(resUpdate);
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: e.toString(),
    });
  }
};
const downloadInFile = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fileModelSchema
      .findById(id)
      .populate({ path: "userDecription", model: "users" });
    const CipherFilePath = path.join(
      __dirname,
      "../../../",
      "uploads/cipher",
      response.fileName
    );
    const cipherFile = fs.readFileSync(CipherFilePath);
    const idCrypto = req.decodeToken.idCrypto;

    const privateKeys = privateKey[idCrypto + 1];
    let tepgiaima = "";
    for (let i = 0; i < response?.userDecription?.length; i++) {
      if (i == 0) tepgiaima += response?.userDecription[i].idCrypto + 1;
      else tepgiaima += "," + (response?.userDecription[i].idCrypto + 1);
    }
    const keyAES = DecryptionBGW(
      idCrypto + 1,
      tepgiaima,
      privateKeys,
      response.C1,
      response.C2,
      async (key) => {
        try {
          const iv = Buffer.from(process.env.IV_CIPHER, "hex");
          const keyBuffer = await convertStringToByte(key);
          const cipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
          const encryptedData = Buffer.concat([
            cipher.update(cipherFile),
            cipher.final(),
          ]);
          const ToFilePath = path.join(
            __dirname,
            "../../../",
            "decrypt",
            response.fileName
          );
          fs.writeFileSync(ToFilePath, encryptedData);
          res.setHeader(
            "Content-disposition",
            `attachment; filename=downloadFile`
          );
          res.setHeader("Content-type", "application/octet-stream");
          const fileStream = fs.createReadStream(ToFilePath);
          fileStream.pipe(res);
        } catch (e) {
          return res.status(404).json({
            success: false,
            message: e.toString(),
          });
        }
      }
    );
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: e.toString(),
    });
  }
};
const playVideoFile = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fileModelSchema
      .findById(id)
      .populate({ path: "userDecription", model: "users" });
    const CipherFilePath = path.join(
      __dirname,
      "../../../",
      "uploads/cipher",
      response.fileName
    );
    const cipherFile = fs.readFileSync(CipherFilePath);
    const idCrypto = req.decodeToken.idCrypto;

    const privateKeys = privateKey[idCrypto + 1];
    let tepgiaima = "";
    for (let i = 0; i < response?.userDecription?.length; i++) {
      if (i == 0) tepgiaima += response?.userDecription[i].idCrypto + 1;
      else tepgiaima += "," + (response?.userDecription[i].idCrypto + 1);
    }
    const keyAES = DecryptionBGW(
      idCrypto + 1,
      tepgiaima,
      privateKeys,
      response.C1,
      response.C2,
      async (key) => {
        try {
          const iv = Buffer.from(process.env.IV_CIPHER, "hex");
          const keyBuffer = await convertStringToByte(key);
          const cipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
          const encryptedData = Buffer.concat([
            cipher.update(cipherFile),
            cipher.final(),
          ]);
          const ToFilePath = path.join(
            __dirname,
            "../../../",
            "decrypt",
            response.fileName
          );
          fs.writeFileSync(ToFilePath, encryptedData);
          res.removeHeader("Content-disposition");
          res.removeHeader("Content-type");

          // Thiết lập header cho video
          res.setHeader("Content-type", "video/mp4");

          const fileStream = fs.createReadStream(ToFilePath);
          fileStream.pipe(res);
        } catch (e) {
          return res.status(404).json({
            success: false,
            message: e.toString(),
          });
        }
      }
    );
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: e.toString(),
    });
  }
};
const editFile = async (req, res) => {
  const { id } = req.params;
  const response = await handleUpdate(fileModelSchema, id, req.body);
  res.status(200).json(response);
};
const deleteFile = async (req, res) => {
  const { id } = req.params;
  const response = await handleDelete(fileModelSchema, id);
  const removeFilePath = path.join(
    __dirname,
    "../../../",
    "uploads/cipher",
    response?.fileName
  );
  unlinkFile(removeFilePath);
  res.status(200).json(response);
};
const uploadImage = async (req, res) => {
  const { postId } = JSON.parse(req.body.jsonData);
  const userID = req.decodeToken._id;
  const newData = {};
  if (req?.file?.filename) {
    newData.fileName = req.file.filename;
    newData.originalFilename = req.file.fileName;
  }
  newData.fileType = FILETYPE_ROLE.IMAGE;
  newData.userOwn = userID;
  newData.postId = postId;
  const response = await handleCreate(fileModelSchema, newData);

  return res.status(200).json(response);
};
const removeImage = async (req, res) => {
  const { id } = req.params;
  const response = await handleDelete(fileModelSchema, id);
  return response;
};
module.exports = {
  createNewFile,
  downloadInFile,
  shareFile,
  editFile,
  deleteFile,
  findFileByCategory,
  playVideoFile,
  uploadImage,
  removeImage
};
