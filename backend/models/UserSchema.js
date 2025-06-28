import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);
