import Upload from '../models/Upload.js';

const likePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const userId = req.user.id || req.user._id;  // Handle both possible structures

        console.log('Debug - userId:', userId);
        console.log('Debug - photoId:', photoId);
        console.log('Debug - req.user:', req.user);

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        const existingLike = photo.likes.find(like => like.userId?.toString() === userId.toString());
        console.log('Debug - existingLike:', existingLike);

        if (existingLike) {
            photo.likes = photo.likes.filter(like => like.userId?.toString() !== userId.toString());
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
        const userId = req.user.id || req.user._id;  // Handle both possible structures

        console.log('Debug - viewPhoto userId:', userId);
        console.log('Debug - viewPhoto photoId:', photoId);
        console.log('Debug - req.user:', req.user);

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        const alreadyViewed = photo.views.find(view => view.userId?.toString() === userId.toString());
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
        const userId = req.user.id || req.user._id;  // Handle both possible structures

        console.log('Debug - Comment userId:', userId);
        console.log('Debug - Comment content:', content);
        console.log('Debug - req.user:', req.user);

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const photo = await Upload.findById(photoId);
        if (!photo) {
            console.log('Debug - Photo not found');
            return res.status(404).json({ message: "Photo not found" });
        }

        photo.comments.push({ userId, content });
        photo.commentsCount = photo.comments.length;

        await photo.save();

        // Populate user info and get the newly added comment
        const populatedPhoto = await Upload.findById(photoId).populate('comments.userId', 'name email');
        const newComment = populatedPhoto.comments[populatedPhoto.comments.length - 1];

        res.status(201).json({
            message: "Comment added",
            comment: newComment,
            comments: populatedPhoto.comments
        });
    } catch (err) {
        console.error('Comment Error:', err);
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { photoId, commentIndex } = req.params;
        const { content } = req.body;
        const userId = req.user.id || req.user._id;  // Handle both possible structures

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

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

const deleteComment = async (req, res) => {
    try {
        const { photoId, commentId } = req.params;
        const userId = req.user.id || req.user._id;

        console.log('Debug - Delete comment photoId:', photoId);
        console.log('Debug - Delete comment commentId:', commentId);
        console.log('Debug - Delete comment userId:', userId);

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        const photo = await Upload.findById(photoId);
        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        // Find the comment
        const commentIndex = photo.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user owns the comment
        const comment = photo.comments[commentIndex];
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Remove the comment
        photo.comments.splice(commentIndex, 1);
        photo.commentsCount = photo.comments.length;

        await photo.save();

        // Return updated comments with populated user info
        const populatedPhoto = await Upload.findById(photoId).populate('comments.userId', 'name email');

        res.json({
            message: "Comment deleted",
            comments: populatedPhoto.comments
        });
    } catch (err) {
        console.error('Delete Comment Error:', err);
        res.status(500).json({ message: "Error deleting comment", error: err.message });
    }
};

export default { replyToComment, addComment, viewPhoto, likePhoto, deleteComment };
