import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', protect, upload.single('image'), (req, res) => {
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

export default router;