const {
  CHUA_DU_THONG_TIN,
  WRONG_PASSWORD,
  recordNewUpdate,
} = require("../../constant/constant");
const { globalParams } = require("../../constant/globalParams");
const { privateKey } = require("../../constant/privateKey");
const { userModelSchema } = require("../../model/userModel");
const {
  getIdUser,
  hashPassword,
  comparePasswords,
} = require("../../utils/utils");
const jwt = require("jsonwebtoken");
const signUp = async (req, res) => {
  try {
    role_user = 'admin';
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(302).json(CHUA_DU_THONG_TIN);
    }
    let idUser = await getIdUser();
    idUser++;
    const hashPasswords = await hashPassword(password);
    const user = await userModelSchema.create({
      username,
      password: hashPasswords,
      roleUser: role_user,
      idCrypto: idUser,
      privateKey: privateKey[idUser],
      publicKey: globalParams[idUser],
    });
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateKeyError = error.keyPattern;
      if (duplicateKeyError.username === 1) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
    } else {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
};
const signIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json(CHUA_DU_THONG_TIN);
  }
  const infoDataUser = await userModelSchema.findOne({ username });
  if (!infoDataUser) {
    return res.status(401).json(WRONG_PASSWORD);
  }
  const statusCode = await comparePasswords(password, infoDataUser.password);
  if (statusCode == false) {
    return res.status(401).json(WRONG_PASSWORD);
  }
  var token = jwt.sign(infoDataUser.toJSON(), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({ token });
};
const getMyInfo = async (req, res) => {
  const { _id } = req.decodeToken;
  const response = await userModelSchema.findOne({ _id });
  return res.status(200).json(response);
};
const updateMyInfo = async (req, res) => {
  try {
    const userID = req.decodeToken._id;
    let dataUpdate = {};
    if (req?.file?.filename) dataUpdate.avatar = req.file.filename;
    const updatedUser = await userModelSchema.findOneAndUpdate(
      { _id: userID },
      { $set: dataUpdate },
      recordNewUpdate
    );

    res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(400).json({ success: false, message: e.toString() });
  }
};
const changeNewPassword = async (req, res) => {
  try {
    const infoDataUser = await userModelSchema.findOne({
      _id: req.decodeToken._id,
    });
    const statusCode = await comparePasswords(
      req.body.old_password,
      infoDataUser.password
    );
    if (statusCode == false) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng" });
    }
    const newPassword = await hashPassword(req.body.new_password);
    const response = await userModelSchema.findOneAndUpdate(
      { _id: req.decodeToken._id },
      { $set: { password: newPassword } },
      recordNewUpdate
    );
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.toString() });
  }
};
const getAllUser = async (req, res) => {
  try {
    const users = await userModelSchema.find({});
    const userMap = [];
    users.forEach((user) => {
      userMap.push(user);
    });
    return res.status(200).json(userMap);
  } catch (e) {
    return res.status(402).json({
      message: e.toString(),
      success: false,
    });
  }
};
module.exports = {
  signUp,
  signIn,
  getMyInfo,
  updateMyInfo,
  changeNewPassword,
  getAllUser,
};
