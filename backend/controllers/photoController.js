import Upload from '../models/Upload.js';

const likePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const userId = req.user.id;  // Getting ID from JWT token

        console.log('Debug - userId:', userId);
        console.log('Debug - photoId:', photoId);

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        const existingLike = photo.likes.find(like => like.userId?.toString() === userId);
        console.log('Debug - existingLike:', existingLike);

        if (existingLike) {
            photo.likes = photo.likes.filter(like => like.userId?.toString() !== userId);
        } else {
            photo.likes.push({ userId });
        }

        photo.likesCount = photo.likes.length;
        await photo.save();

        res.json({ message: existingLike ? "Unliked" : "Liked", likesCount: photo.likesCount });
    } catch (err) {
        console.error('Like Photo Error:', err);
        res.status(500).json({ message: "Error updating like", error: err.message });
    }
};

const viewPhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const userId = req.user.id;  // Getting ID from JWT token

        console.log('Debug - viewPhoto userId:', userId);
        console.log('Debug - viewPhoto photoId:', photoId);

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        const alreadyViewed = photo.views.find(view => view.userId?.toString() === userId);
        console.log('Debug - alreadyViewed:', alreadyViewed);

        if (!alreadyViewed) {
            photo.views.push({ userId });
            photo.viewsCount = photo.views.length;
            await photo.save();
        }

        res.json({ message: "View registered", viewsCount: photo.viewsCount });
    } catch (err) {
        console.error('View Photo Error:', err);
        res.status(500).json({ message: "Error updating views", error: err.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { photoId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;  // Getting ID from JWT token

        console.log('Debug - Comment userId:', userId);
        console.log('Debug - Comment content:', content);

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        photo.comments.push({ userId, content });
        photo.commentsCount = photo.comments.length;

        await photo.save();

        // Populate user info before sending response
        const populatedPhoto = await Upload.findById(photoId).populate('comments.userId', 'name');

        res.status(201).json({ message: "Comment added", comments: populatedPhoto.comments });
    } catch (err) {
        console.error('Comment Error:', err);
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { photoId, commentIndex } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const photo = await Upload.findById(photoId);
        if (!photo || !photo.comments[commentIndex]) {
            return res.status(404).json({ message: "Comment not found" });
        }

        photo.comments[commentIndex].replies.push({ userId, content });
        await photo.save();

        // Populate user info before sending response
        const populatedPhoto = await Upload.findById(photoId).populate('comments.userId', 'name');

        res.status(201).json({ message: "Reply added", comment: populatedPhoto.comments[commentIndex] });
    } catch (err) {
        res.status(500).json({ message: "Error replying to comment", error: err.message });
    }
};

export default { replyToComment, addComment, viewPhoto, likePhoto };
