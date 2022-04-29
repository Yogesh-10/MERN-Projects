const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    //rejected files
    cb({ message: 'Unsupported file format' }, false);
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    files: 1, //1 file per request
    fileSize: 1024 * 1024, // 1 MB (max file size)
  },
});

//Image Resizing
const profilePhotoResize = async (req, res, next) => {
  try {
    //check if there is no file
    if (!req.file) return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    await sharp(req.file.buffer)
      .resize(250, 250)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(
        path.join(__dirname, `../../public/images/profile/${req.file.filename}`)
      );

    next();
  } catch (error) {
    res.json({ msg: error.message });
  }
};

module.exports = { profilePhotoUpload, profilePhotoResize };
