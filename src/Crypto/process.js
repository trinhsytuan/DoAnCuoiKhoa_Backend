const { exec } = require("child_process");
const path = require("path");

async function EncryptionBGW(idCrypto, callback) {
  const absoluteFilePath = path.join(__dirname, "MaHoa");
  exec(
    `${absoluteFilePath} ${idCrypto}`,
    { shell: true },
    (error, stdout, stderr) => {
      //Tham so dau ra
      //1 la khoa K, C1, C2, t
      callback(stdout);
    }
  );
}
function ReEncryptionBGW(t, idCrypto, callback) {
  const absoluteFilePath = path.join(__dirname, "MaHoaT");
  exec(`${absoluteFilePath} ${t.replace(/[\[\]]/g, '')} ${idCrypto}`, (error, stdout, stderr) => {
    //Tham so dau ra
    //1 la khoa C1, C2, t
    callback(stdout);
  });
}
function DecryptionBGW(idCrypto, tapgiaima, privateKey, C1, C2, callback) {
  const absoluteFilePath = path.join(__dirname, "GiaiMa");
  exec(
    `${absoluteFilePath} ${idCrypto} ${tapgiaima} ${privateKey.replace(/[\[\]]/g, '')} ${C1.replace(/[\[\]]/g, '')} ${C2.replace(/[\[\]]/g, '')}`,
    (error, stdout, stderr) => {
      //Tham so dau ra
      //1 la khoa K, C1, C2, t
      callback(stdout);
    }
  );
}

module.exports = {
  EncryptionBGW,
  ReEncryptionBGW,
  DecryptionBGW,
};
