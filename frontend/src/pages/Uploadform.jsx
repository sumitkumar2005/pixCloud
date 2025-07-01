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
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photo</h2>
                <p className="text-gray-600">Share your amazing photos with the community</p>
            </div>

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors duration-200 
                    ${dragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white'
                    } hover:border-blue-500`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                        <button
                            onClick={() => {
                                setFile(null);
                                setPreview(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <label className="px-4 py-2 rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-colors">
                                Choose a file
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                            <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-4 ${
                    message.includes('error') || message.includes('large')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Give your photo a title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        rows="3"
                        placeholder="Add a description for your photo"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!file || isUploading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        !file || isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                </button>
            </div>
        </div>
    );
};

export default UploadForm;
