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
function ReEncryptionBGW(t, idCrypto) {
  const absoluteFilePath = path.join(__dirname, "MaHoaT");
  exec(`${absoluteFilePath} ${t} ${idCrypto}`, (error, stdout, stderr) => {
    //Tham so dau ra
    //1 la khoa C1, C2, t
    return stdout;
  });
}
function DecryptionBGW(idCrypto, privateKey, C1, C2) {
  const absoluteFilePath = path.join(__dirname, "GiaiMa");
  exec(
    `${absoluteFilePath} ${idCrypto} ${privateKey} ${C1} ${C2}`,
    (error, stdout, stderr) => {
      //Tham so dau ra
      //1 la khoa K, C1, C2, t
      return stdout;
    }
  );
}

module.exports = {
  EncryptionBGW,
  ReEncryptionBGW,
  DecryptionBGW,
};
