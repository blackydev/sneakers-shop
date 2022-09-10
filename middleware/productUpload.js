const multer = require("multer");
const config = require("config");
const generateFilename = require("../utils/generateFilename");
const filesPath = config.get("public") + "images/products/";
const winston = require("winston");

const maxSize = 1024 * 1024 * 1.3;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filesPath);
  },
  filename: async function (req, file, cb) {
    let filename = generateFilename(file.originalname);

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize > maxSize) return cb(null, false);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  )
    cb(null, true);
  else cb(null, false);
};

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize, //TODO: dont create image if too big
  },
  fileFilter: fileFilter,
});
