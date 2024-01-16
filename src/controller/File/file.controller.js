const crypto = require('crypto');
const fs = require('fs');
const {handleCreate} = require("../../config/baseChung");
const {fileModelSchema} = require("../../model/fileModel");
require("dotenv").config();
const createNewFile = async (req, res) => {
    const FileNameOrigin = req.file.filename;
    const idUser = req.decodeToken.idCrypto;
    const cipherFileName = fs.readFileSync(`../../uploads/${FileNameOrigin}`);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(password, 'salt', 32), iv);
    const encryptedData = Buffer.concat([cipher.update(inputFile), cipher.final()]);
    const outputFilePath = `../../uploads/cipher/${FileNameOrigin}`;
    fs.writeFileSync(outputFilePath, encryptedData);
    const response = await handleCreate(fileModelSchema, {});
    res.status(200).json(response);
}
const downloadInFile = (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=1705326597035-962138459-gpt.jpeg');
    res.setHeader('Content-type', 'application/octet-stream');
    const fileStream = fs.createReadStream("/Users/tuan/Documents/DoAnCuoiKhoa_Backend/uploads/1705326597035-962138459-gpt.jpeg");
    fileStream.pipe(res);
}

module.exports = {createNewFile, downloadInFile}