import express from 'express';
import {
    createFood,
    getFoods,
    getFoodById,
    updateFood,
    deleteFood
} from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createFood) // Protect this route
    .get(getFoods);

router.route('/:id')
    .get(getFoodById)
    .put(protect, updateFood) // Protect this route
    .delete(protect, deleteFood); // Protect this route

export default router;