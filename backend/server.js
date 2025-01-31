import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import path from 'path';

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// DB config
connectDB();

// routes
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/foods', foodRoutes);

// Serve static files from the uploads directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => res.status(200).send('API is running'));

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));