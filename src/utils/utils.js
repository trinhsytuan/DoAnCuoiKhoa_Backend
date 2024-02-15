const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const randomstring = require("randomstring");
const crypto = require("crypto");
const { ROLE_SYSTEM } = require("../constant/constant");
const { userModelSchema } = require("../model/userModel");

function makeid(length) {
  return randomstring.generate(length);
}
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
async function checkToken(req, res, next) {
  const tokenFromClient =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  if (tokenFromClient) {
    try {
      const decoded = await jwt.verify(
        tokenFromClient,
        process.env.ACCESS_TOKEN_SECRET
      );
      req.decodeToken = decoded;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
  } else {
    return res.status(401).send({
      message: "No token provided.",
    });
  }
}
function checkAdmin(req, res, next) {
  if (req.decodeToken.org.type == ROLE_SYSTEM.ADMIN) next();
  else
    return res.status(401).send({
      message: "You are not authorized to perform this action",
    });
}
function queryUserFromDB(idUser) {
  try {
    return userModelSchema.findOne({ _id: idUser }).populate("org");
  } catch (e) {
    throw new Error(e);
  }
}

function computeMD5Hash(input) {
  const hash = crypto.createHash("md5").update(input).digest("hex");
  return hash;
}
function checkMongoUpdate(mongo, message = "Cập nhật thông tin thành công") {
  if (mongo.matchedCount > 0) {
    return message;
  } else throw new Error("Lỗi khi cập nhật thông tin");
}
function checkMongoDelete(mongo, message = "Xoá bản ghi thành công") {
  if (mongo.deletedCount === 1) {
    return message;
  } else {
    throw new Error("Không tồn tại bản ghi");
  }
}
function searchLike(params) {
  if (params?.like) return new RegExp(params.like, "i");
  else if (params) return params;
  else return null;
}
function checkMessageDuplicateMongo(error) {
  const message = error.keyPattern;
  const key = Object.keys(message);
  if (key && key.length > 0) return key[0];
}
function checkMessageDuplicateMongoAutoRender(error) {
  const message = error.keyPattern;
  const key = Object.keys(message);
  if (key && key.length > 0) return key[0] + " đã tồn tại";
}
async function getIdUser() {
  try {
    const infoUser = await userModelSchema.findOne({}).sort({ createdAt: -1 });
    return infoUser.idCrypto;
  } catch {
    return -1;
  }
}
async function convertStringToByte(string) {
  const hash = crypto.createHash("sha256");
  hash.update(string, "utf-8"); // Cập nhật với chuỗi đầu vào và encoding là utf-8
  return Buffer.from(hash.digest("hex"), "hex"); // Trả về dạng hex của chuỗi byte băm
}
function unlinkFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
}
module.exports = {
  makeid,
  hashPassword,
  checkMongoDelete,
  checkAdmin,
  comparePasswords,
  checkToken,
  searchLike,
  queryUserFromDB,
  unlinkFile,
  computeMD5Hash,
  getIdUser,
  checkMongoUpdate,
  checkMessageDuplicateMongo,
  checkMessageDuplicateMongoAutoRender,
  convertStringToByte,
};
