const util = require("util");
const multer = require("multer");
const path = require('path');
//const { v4: uuidv4 } = require('uuid');
const maxSize = 1 * 1024 * 1024; // 1 = 1MB, 2 = 2MB

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    //const ext = path.extname(file.originalname); // Get file extension
    //global.fileName = `${uuidv4()}${ext}`;
    //cb(null, fileName);
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
}).single("profileImage");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
