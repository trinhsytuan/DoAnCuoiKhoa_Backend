const {
  CHUA_DU_THONG_TIN,
  WRONG_PASSWORD,
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
  const { username, password, roleUser } = req.body;
  if (!username || !password || !roleUser) {
    return res.status(302).json(CHUA_DU_THONG_TIN);
  }
  let idUser = await getIdUser();
  idUser++;
  const hashPasswords = await hashPassword(password);
  const user = await userModelSchema.create({
    username,
    password: hashPasswords,
    roleUser,
    idCrypto: idUser,
    privateKey: privateKey[idUser],
    publicKey: globalParams[idUser],
  });
  res.status(200).json(user);
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
module.exports = { signUp, signIn, getMyInfo };
