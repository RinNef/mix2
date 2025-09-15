const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({ storage });

const controller = require('../controllers/homestays');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', upload.array('images', 10), controller.create);
router.put('/:id', upload.array('images', 10), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
