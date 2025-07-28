import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Eye, MessageCircle, ArrowLeft, Send, User, Download, Share2, Calendar, MapPin, Trash2, MoreHorizontal, ExternalLink } from 'lucide-react';

const PhotoInfo = () => {
    const { photoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useAuth();

    const [photo, setPhoto] = useState(location.state?.photo || null);
    const [loading, setLoading] = useState(!location.state?.photo);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingPhoto, setDeletingPhoto] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                setLoading(true);

                // If photo data is already available from navigation state, use it
                if (location.state?.photo) {
                    const photoData = location.state.photo;
                    setPhoto(photoData);
                    setComments(photoData.comments || []);
                    setViews(photoData.views?.length || 0);
                    setLikes(photoData.likes?.length || 0);

                    if (user) {
                        setLiked(photoData.likes?.some(like => like.userId === user._id) || false);
                    }
                    setLoading(false);
                    return;
                }

                // Otherwise, fetch from all photos and find the matching one
                const response = await axios.get('http://localhost:5000/all-photos');
                const allPhotos = response.data;
                const photoData = allPhotos.find(p => p._id === photoId);

                if (!photoData) {
                    setError('Photo not found');
                    setLoading(false);
                    return;
                }

                setPhoto(photoData);
                setComments(photoData.comments || []);
                setViews(photoData.views?.length || 0);
                setLikes(photoData.likes?.length || 0);

                if (user) {
                    setLiked(photoData.likes?.some(like => like.userId === user._id) || false);
                }

                // Mark photo as viewed
                if (user && token) {
                    markAsViewed();
                }
            } catch (err) {
                console.error('Error fetching photo:', err);
                setError('Failed to load photo details');
            } finally {
                setLoading(false);
            }
        };

        if (photoId) {
            fetchPhoto();
        }
    }, [photoId, user, token, location.state]);

    const markAsViewed = async () => {
        try {
            await axios.put(
                `http://localhost:5000/photos/${photoId}/view`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setViews(prev => prev + 1);
        } catch (err) {
            console.error('Error marking view:', err);
        }
    };

    const handleLike = async () => {
        if (!user || !token || isLiking) return;

        setIsLiking(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/photos/${photoId}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
        } catch (err) {
            console.error('Error toggling like:', err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async () => {
        if (!user || !token || !newComment.trim() || commentLoading) return;

        setCommentLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5000/photos/${photoId}/comment`,
                { content: newComment.trim() },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Use the updated comments array from response
            setComments(response.data.comments);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!user || !token) return;

        try {
            const response = await axios.delete(
                `http://localhost:5000/photos/${photoId}/comment/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update comments with the response
            setComments(response.data.comments);
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const handleDeletePhoto = async () => {
        if (!user || !token || deletingPhoto) return;

        setDeletingPhoto(true);
        try {
            await axios.delete(
                `http://localhost:5000/photos/${photoId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Navigate back after successful deletion
            navigate(-1);
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Failed to delete photo. Please try again.');
        } finally {
            setDeletingPhoto(false);
            setShowDeleteConfirm(false);
        }
    };

    const canDeletePhoto = user && photo && (photo.uploadedBy === user._id || photo.userId === user._id);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading photo...</p>
                </div>
            </div>
        );
    }

    if (error || !photo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center max-w-md mx-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye size={24} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Photo Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The photo you are looking for does not exist or may have been removed.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const imageUrl = `http://localhost:5000/uploads/${photo.filename}`;

    return (
        <div className="min-h-screen bg-white">
            {/* Pinterest-style Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <div className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={20} />
                            </div>
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                                <ExternalLink size={20} />
                            </button>
                            {canDeletePhoto && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700"
                                    title="Delete photo"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Pinterest Layout */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Image */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <img
                                src={imageUrl}
                                alt={photo.title || photo.filename}
                                className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                            />

                            {/* Pinterest-style floating action buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Share2 size={16} className="text-gray-700" />
                                </button>
                                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Download size={16} className="text-gray-700" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {user && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-200 ${
                                        liked
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    <Heart size={18} className={`inline mr-2 ${liked ? 'fill-current' : ''}`} />
                                    {liked ? 'Saved' : 'Save'}
                                </button>
                                <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Share2 size={18} className="inline mr-2" />
                                    Share
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details & Comments */}
                    <div className="space-y-6">
                        {/* Photo Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                {photo.title || 'Untitled Photo'}
                            </h1>

                            {photo.description && (
                                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                                    {photo.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <Heart size={16} />
                                    <span>{likes} likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye size={16} />
                                    <span>{views} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle size={16} />
                                    <span>{comments.length} comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Author Section */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{photo.author || 'Anonymous'}</h3>
                                <p className="text-sm text-gray-600">Photographer</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                                Follow
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Comments ({comments.length})
                            </h3>

                            {/* Add Comment */}
                            {user && (
                                <div className="mb-6">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="w-full p-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                                                rows={3}
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    onClick={handleComment}
                                                    disabled={!newComment.trim() || commentLoading}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {commentLoading ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User size={16} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {comment.userId?.name || comment.author || 'Anonymous'}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-gray-500">
                                                                {formatDate(comment.createdAt || comment.date)}
                                                            </p>
                                                            {user && comment.userId?._id === user._id && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                                    title="Delete comment"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {comment.content || comment.comment || comment.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 mb-1">No comments yet</p>
                                        <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Photo</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this photo? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={deletingPhoto}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={deletingPhoto}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {deletingPhoto ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoInfo;