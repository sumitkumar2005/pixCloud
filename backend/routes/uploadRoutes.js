// routes/photoRoutes.js
import express from 'express';
import upload from '../config/multerConfig.js';
import authenticate from '../middlewares/authMiddleware.js';
import Photo from '../models/Upload.js'; // MongoDB model

const router = express.Router();


router.get('/photos', authenticate, async (req, res) => {
    try {
        const photos = await Photo.find({ userId: req.user.id });
        res.status(200).json(photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/upload', authenticate, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newPhoto = new Photo({
            filename: req.file.filename,
            title: req.body.title,
            description: req.body.description,
            author: req.body.author || req.user.name, // fallback if not provided
            userId: req.user.id
        });

        await newPhoto.save();
        res.status(201).json({
            message: 'Photo uploaded successfully',
            photo: newPhoto
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
