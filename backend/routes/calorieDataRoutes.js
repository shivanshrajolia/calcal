import express from 'express';
import {
    addBreakfast,
    addMorningSnacks,
    addLunch,
    addEveningSnacks,
    addDinner,
    removeCalorieData,
    getCalorieDataByUserAndDate,
    getCalorieSumByUserAndDate,
} from '../controllers/calorieDataController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addbreakfast', protect, addBreakfast);
router.post('/addmorningsnacks', protect, addMorningSnacks);
router.post('/addlunch', protect, addLunch);
router.post('/addeveningsnacks', protect, addEveningSnacks);
router.post('/adddinner', protect, addDinner);

router.delete('/remove/:id', protect, removeCalorieData);

router.get('/', protect, getCalorieDataByUserAndDate);
router.get('/sum', protect, getCalorieSumByUserAndDate);

export default router;