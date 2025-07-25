import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Heart, Eye, MessageCircle, X, Send, User } from 'lucide-react';

const PhotoModal = ({ photo, onClose }) => {
    const { user, token } = useAuth();
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState(photo.comments || []);
    const [newComment, setNewComment] = useState('');
    const [views, setViews] = useState(photo.views?.length || 0);
    const [likes, setLikes] = useState(photo.likes?.length || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setLiked(photo.likes.some(like => like.userId === user._id));
        }

        const markViewed = async () => {
            if (!user || !token) {
                console.log('Debug - No user or token available');
                return;
            }
            try {
                console.log('Debug - Marking view for photo:', photo._id);
                console.log('Debug - User:', user._id);
                const response = await axios.put(
                    `http://localhost:5000/photos/${photo._id}/view`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log('Debug - View response:', response.data);
                setViews(prev => prev + 1);
            } catch (err) {
                console.error('Error marking view:', err.response?.data || err.message);
            }
        };
        markViewed();
    }, [photo._id, user, token]);

    const handleLike = async () => {
        if (!user || !token || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/photos/${photo._id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.message === "Liked") {
                setLiked(true);
                setLikes(prev => prev + 1);
            } else {
                setLiked(false);
                setLikes(prev => prev - 1);
            }
        } catch (err) {
            console.error('Error liking photo:', err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        if (!user || !token) {
            console.log('Debug - No user or token available for comment');
            return;
        }

        setCommentLoading(true);
        try {
            console.log('Debug - Adding comment to photo:', photo._id);
            const response = await axios.post(
                `http://localhost:5000/photos/${photo._id}/comment`,
                {
                    content: newComment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('Debug - Comment response:', response.data);
            setComments(response.data.comments);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err.response?.data || err.message);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-40" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2 transition-colors duration-200 shadow-md"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                <div className="flex flex-col lg:flex-row h-full">
                    {/* Image Section */}
                    <div className="lg:w-2/3 bg-gray-50 flex items-center justify-center p-6">
                        <img
                            src={`http://localhost:5000/uploads/${photo.filename}`}
                            alt={photo.title}
                            className="max-h-[70vh] max-w-full object-contain rounded-lg"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/3 flex flex-col h-full border-l border-gray-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{photo.title}</h2>
                            <p className="text-gray-600 mb-3">{photo.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <User size={16} className="mr-2" />
                                <span>by {photo.author}</span>
                            </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={handleLike}
                                    disabled={isLoading}
                                    className={`flex items-center space-x-2 transition-colors duration-200 ${
                                        liked
                                            ? 'text-red-500'
                                            : 'text-gray-600 hover:text-red-500'
                                    } ${isLoading ? 'opacity-50' : ''}`}
                                >
                                    <Heart
                                        size={20}
                                        className={`${liked ? 'fill-current' : ''}`}
                                    />
                                    <span className="font-medium">{likes}</span>
                                </button>

                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Eye size={20} />
                                    <span className="font-medium">{views}</span>
                                </div>

                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MessageCircle size={20} />
                                    <span className="font-medium">{comments.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="flex-1 flex flex-col p-6">
                            <h3 className="text-lg font-medium mb-4 text-gray-900">Comments</h3>

                            {/* Comments List */}
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-64">
                                {comments.length > 0 ? (
                                    comments.map((c) => (
                                        <div key={c._id} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                                                    <User size={14} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm">{c.userId.name}</p>
                                                    <p className="text-gray-600 text-sm mt-1">{c.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageCircle size={32} className="mx-auto mb-3 text-gray-300" />
                                        <p>No comments yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex space-x-3">
                                    <textarea
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        rows={2}
                                    />
                                    <button
                                        onClick={handleCommentSubmit}
                                        disabled={!newComment.trim() || commentLoading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                                    >
                                        {commentLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;