import express from 'express';
import {
    addWeight,
    listWeight,
    updateWeight,
    deleteWeight,
} from '../controllers/weightDataController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addweight', protect, addWeight);
router.get('/listweight', protect, listWeight);
router.route('/:id').put(protect, updateWeight).delete(protect, deleteWeight);

export default router;
