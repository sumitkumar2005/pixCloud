import React from 'react';
import { Eye, Heart, Share2, Download, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';

const PhotoCard = ({
    photo,
    viewMode = 'grid',
    onPhotoClick,
    showActions = true,
    showAuthor = true,
    onActionClick
}) => {
    const navigate = useNavigate();

    const handleActionClick = (e, action) => {
        e.stopPropagation();
        if (onActionClick) {
            onActionClick(action, photo);
        }
    };

    const handlePhotoClick = () => {
        // Navigate to photo details page with photo data
        navigate(`/photo/${photo._id}`, {
            state: { photo: photo }
        });

        // Also call the onPhotoClick prop if provided (for backward compatibility)
        if (onPhotoClick) {
            onPhotoClick(photo);
        }
    };

    const displayDate = photo.uploadDate || photo.uploadedAt;
    const imageUrl = `http://localhost:5000/uploads/${photo.filename}`;

    const renderActions = () => (
        <div className="flex items-center justify-between w-full">
            <div className="flex gap-4">
                <button
                    onClick={(e) => handleActionClick(e, 'like')}
                    className="flex items-center gap-2 text-white hover:text-pink-300 transition-all duration-200 group"
                >
                    <Heart size={18} className="group-hover:scale-110 transition-transform duration-200 drop-shadow-lg" />
                    <span className="text-sm font-medium drop-shadow-lg">{photo.likes?.length || 0}</span>
                </button>
                <button
                    onClick={(e) => handleActionClick(e, 'view')}
                    className="flex items-center gap-2 text-white hover:text-blue-300 transition-all duration-200 group"
                >
                    <Eye size={18} className="group-hover:scale-110 transition-transform duration-200 drop-shadow-lg" />
                    <span className="text-sm font-medium drop-shadow-lg">{photo.views?.length || 0}</span>
                </button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={(e) => handleActionClick(e, 'share')}
                    className="p-2 rounded-lg text-white hover:text-emerald-300 hover:bg-black/20 transition-all duration-200 drop-shadow-lg"
                >
                    <Share2 size={16} />
                </button>
                <button
                    onClick={(e) => handleActionClick(e, 'download')}
                    className="p-2 rounded-lg text-white hover:text-purple-300 hover:bg-black/20 transition-all duration-200 drop-shadow-lg"
                >
                    <Download size={16} />
                </button>
            </div>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div
                className="glass-content group cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300 slide-up border border-white/30"
                onClick={handlePhotoClick}
            >
                <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-64 md:h-48 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={photo.title || photo.filename}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between bg-white/95">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                                {photo.title || 'Untitled Photo'}
                            </h3>
                            {photo.description && (
                                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {photo.description}
                                </p>
                            )}

                            {showAuthor && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{photo.author || 'Anonymous'}</p>
                                        <p className="text-sm text-gray-500">{formatRelativeTime(displayDate)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showActions && (
                            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                                <button onClick={(e) => handleActionClick(e, 'like')} className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors duration-200">
                                    <Heart size={18} />
                                    <span className="font-medium">{photo.likes?.length || 0}</span>
                                </button>
                                <button onClick={(e) => handleActionClick(e, 'view')} className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                                    <Eye size={18} />
                                    <span className="font-medium">{photo.views?.length || 0}</span>
                                </button>
                                <button onClick={(e) => handleActionClick(e, 'share')} className="text-gray-600 hover:text-emerald-500 transition-colors duration-200">
                                    <Share2 size={18} />
                                </button>
                                <button onClick={(e) => handleActionClick(e, 'download')} className="text-gray-600 hover:text-purple-500 transition-colors duration-200">
                                    <Download size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div
            className="group cursor-pointer slide-up"
            onClick={handlePhotoClick}
        >
            <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] glass-content border border-white/30">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={photo.title || photo.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        {/* Top Actions */}
                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleActionClick(e, 'share')}
                                    className="p-2 bg-black/40 backdrop-blur-sm rounded-lg text-white hover:bg-black/60 transition-all duration-200 border border-white/20"
                                >
                                    <Share2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => handleActionClick(e, 'download')}
                                    className="p-2 bg-black/40 backdrop-blur-sm rounded-lg text-white hover:bg-black/60 transition-all duration-200 border border-white/20"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="space-y-3">
                            {photo.title && (
                                <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                                    {photo.title}
                                </h3>
                            )}

                            {showAuthor && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm drop-shadow-lg">{photo.author || 'Anonymous'}</p>
                                            <p className="text-white/90 text-xs drop-shadow-md">{formatRelativeTime(displayDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showActions && renderActions()}
                        </div>
                    </div>
                </div>

                {/* Bottom Info Bar - Always Visible */}
                <div className="bg-white/95 p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-gray-800 font-semibold text-sm truncate">
                                {photo.title || 'Untitled Photo'}
                            </h4>
                            <p className="text-gray-500 text-xs">
                                by {photo.author || 'Anonymous'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                            <div className="flex items-center gap-1 text-gray-600">
                                <Heart size={14} />
                                <span className="text-xs font-medium">{photo.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                <Eye size={14} />
                                <span className="text-xs font-medium">{photo.views?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoCard;