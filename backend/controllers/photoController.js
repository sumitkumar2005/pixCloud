 const likePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const userId = req.user.id;

        const photo = await Photo.findById(photoId);
        if (!photo) return res.status(404).json({ message: "Photo not found" });

        const existingLike = photo.likes.find(like => like.userId.toString() === userId);

        if (existingLike) {
            // Unlike
            photo.likes = photo.likes.filter(like => like.userId.toString() !== userId);
        } else {
            // Like
            photo.likes.push({ userId });
        }

        photo.likesCount = photo.likes.length;
        await photo.save();

        res.json({ message: existingLike ? "Unliked" : "Liked", likesCount: photo.likesCount });
    } catch (err) {
        res.status(500).json({ message: "Error updating like", error: err.message });
    }
};
 const viewPhoto = async (req, res) => {
     try {
         const { photoId } = req.params;
         const userId = req.user?.id; // Optional: allow guests

         const photo = await Photo.findById(photoId);
         if (!photo) return res.status(404).json({ message: "Photo not found" });

         const alreadyViewed = photo.views.find(view => view.userId?.toString() === userId);
         if (!alreadyViewed) {
             photo.views.push({ userId });
             photo.viewsCount = photo.views.length;
             await photo.save();
         }

         res.json({ message: "View registered", viewsCount: photo.viewsCount });
     } catch (err) {
         res.status(500).json({ message: "Error updating views", error: err.message });
     }
 };

 const addComment = async (req, res) => {
     try {
         const { photoId } = req.params;
         const { content } = req.body;
         const userId = req.user.id;

         const photo = await Photo.findById(photoId);
         if (!photo) return res.status(404).json({ message: "Photo not found" });

         photo.comments.push({ userId, content });
         photo.commentsCount = photo.comments.length;

         await photo.save();

         res.status(201).json({ message: "Comment added", comments: photo.comments });
     } catch (err) {
         res.status(500).json({ message: "Error adding comment", error: err.message });
     }
 };

 const replyToComment = async (req, res) => {
     try {
         const { photoId, commentIndex } = req.params;
         const { content } = req.body;
         const userId = req.user.id;

         const photo = await Photo.findById(photoId);
         if (!photo || !photo.comments[commentIndex]) {
             return res.status(404).json({ message: "Comment not found" });
         }

         photo.comments[commentIndex].replies.push({ userId, content });
         await photo.save();

         res.status(201).json({ message: "Reply added", comment: photo.comments[commentIndex] });
     } catch (err) {
         res.status(500).json({ message: "Error replying to comment", error: err.message });
     }
 };

 export default {replyToComment, addComment, viewPhoto, likePhoto};