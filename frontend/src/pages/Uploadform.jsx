import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
const MAX_FILE_SIZE_MB = 10;

const UploadForm = ({ token }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setMessage('File too large (Max 10MB)');
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setMessage('');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile.type.startsWith('image/')) {
            setMessage('Invalid file type');
            return;
        }

        if (droppedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setMessage('File too large (Max 10MB)');
            return;
        }

        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setMessage('Please select a file');

        setIsUploading(true);
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', author);


        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage('✅ Upload successful!');
            setFile(null);
            setPreview(null);
            navigate('/my-posts')
        } catch (error) {
            setMessage(error.response?.data?.error || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const resetFile = () => {
        setFile(null);
        setPreview(null);
        setTitle('');
        setDescription('');
        setAuthor('');

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-12">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">📤 Upload Photo</h2>
                    <p className="text-gray-500 text-sm">Show your creativity to the world</p>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring disabled:bg-gray-100"
                        disabled={isUploading}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring disabled:bg-gray-100"
                        disabled={isUploading}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Author (optional)"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring disabled:bg-gray-100"
                        disabled={isUploading}
                    />
                </div>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                        dragOver ? 'border-blue-500 bg-blue-100' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />

                    {!file ? (
                        <>
                            <div className="text-5xl">📁</div>
                            <p className="text-lg font-medium text-gray-700 mt-2">Drag & Drop or Click to Browse</p>
                            <p className="text-sm text-gray-500 mt-1">Max size: 10MB | JPG, PNG, WebP</p>
                        </>
                    ) : (
                        <div className="space-y-2">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mx-auto h-32 w-32 object-cover rounded-lg border"
                                />
                            )}
                            <p className="text-green-700 font-medium">{file.name}</p>
                            <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button type="button" onClick={resetFile} className="text-red-500 text-sm underline">
                                Remove file
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!file || isUploading}
                    className={`w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                        !file || isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-md'
                    }`}
                >
                    {isUploading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        'Upload Photo'
                    )}
                </button>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded-xl text-center text-sm font-medium transition-all duration-300 ${
                            message.includes('✅')
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadForm;
