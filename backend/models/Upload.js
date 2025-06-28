import mongoose from "mongoose";
const photoSchema = new mongoose.Schema({
    filename: String,
    title: String,
    description: String,
    author: String,
    uploadDate: { type: Date, default: Date.now },
    userId: { type:String, required: true },
});
const Photo = mongoose.model("Photo", photoSchema);

export default Photo;