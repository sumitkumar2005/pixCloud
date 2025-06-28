import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connect()
app.use(cors());
app.use(express.json());
app.use("/Uploads", express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('server started');
})

app.use('/auth', authRoutes);
app.use(uploadRoutes);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})
