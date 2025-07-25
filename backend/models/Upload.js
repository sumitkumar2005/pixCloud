import mongoose from "mongoose";

// Each reply is a flat structure (no further nesting)
const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

// Comments can contain replies, but replies cannot contain replies
const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema] // One-level replies only
});

const photoSchema = new mongoose.Schema({
    filename: String,
    title: String,
    description: String,
    author: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },

    likes: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            likedAt: { type: Date, default: Date.now }
        }
    ],
    likesCount: { type: Number, default: 0 },

    views: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            viewedAt: { type: Date, default: Date.now }
        }
    ],
    viewsCount: { type: Number, default: 0 },

    comments: [commentSchema],
    commentsCount: { type: Number, default: 0 }
});

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;
