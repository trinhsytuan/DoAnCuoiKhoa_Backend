const md5 = require("md5");
const { createLiveStream } = require("../../livestream/livestream");
const { makeid } = require("../../utils/utils");

String.prototype.format = function () {
  let formatted = this;
  for (let i = 0; i < arguments.length; i++) {
    const regex = new RegExp("\\{" + i + "\\}", "gm");
    formatted = formatted.replace(regex, arguments[i]);
  }
  return formatted;
};
const getKeyLivestream = async(req, res) => {
  const {_id} = req.decodeToken;
  
  const keyLivestream = genKey(req?.body?.streamName);
  return res.status(200).json(keyLivestream);
}
const addPost = async (req, res) => {
  const {type} = req.body;
  const keyLivestream = genKey(req?.body?.streamName);
  
  createLiveStream(keyLivestream);
  return res.status(200).json({ message: "Success" });
};
const genKey = async (key) => {
  const idStream = makeid(20);
  const initialDate = new Date();

  const expirationDate = new Date(
    initialDate.getFullYear() + 1,
    initialDate.getMonth(),
    initialDate.getDate(),
    initialDate.getHours(),
    initialDate.getMinutes(),
    initialDate.getSeconds()
  );

  const expirationTimestamp = expirationDate.getTime() / 1000;
  const idStreamKey = "{0}-{1}-{2}".format(
    idStream,
    expirationTimestamp,
    md5(key)
  );
  return {
    livestreamKey: idStreamKey,
    streamName: idStream,
  };
};
module.exports = { addPost };
