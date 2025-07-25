import React from 'react';
import { Eye, Heart, Share2, Download } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

const PhotoCard = ({
    photo,
    viewMode = 'grid',
    onPhotoClick,
    showActions = true,
    showAuthor = true,
    onActionClick
}) => {
    const handleActionClick = (e, action) => {
        e.stopPropagation();
        if (onActionClick) {
            onActionClick(action, photo);
        }
    };

    const displayDate = photo.uploadDate || photo.uploadedAt;
    const imageUrl = `http://localhost:5000/uploads/${photo.filename}`;

    const renderActions = () => (
        <div className="flex gap-4 text-gray-600">
            <button onClick={(e) => handleActionClick(e, 'like')} className="flex items-center gap-1 hover:text-blue-500">
                <Heart size={20} /> {photo.likes?.length || 0}
            </button>
            <button onClick={(e) => handleActionClick(e, 'view')} className="flex items-center gap-1 hover:text-blue-500">
                <Eye size={20} /> {photo.views?.length || 0}
            </button>
            <button onClick={(e) => handleActionClick(e, 'share')} className="flex items-center gap-1 hover:text-blue-500">
                <Share2 size={20} />
            </button>
            <button onClick={(e) => handleActionClick(e, 'download')} className="flex items-center gap-1 hover:text-blue-500">
                <Download size={20} />
            </button>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                onClick={() => onPhotoClick && onPhotoClick(photo)}
            >
                <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-64 md:h-48 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={photo.title || photo.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-700">
                            {formatRelativeTime(displayDate)}
                        </div>
                    </div>
                    <div className="flex-1 p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            {photo.title || photo.filename}
                        </h3>
                        {photo.description && (
                            <p className="text-gray-600 mb-4">{photo.description}</p>
                        )}
                        {showAuthor && photo.author && (
                            <p className="text-sm text-gray-500 mb-4">By {photo.author}</p>
                        )}
                        {showActions && renderActions()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
            onClick={() => onPhotoClick && onPhotoClick(photo)}
        >
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={imageUrl}
                    alt={photo.title || photo.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-700">
                    {formatRelativeTime(displayDate)}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 truncate">
                    {photo.title || photo.filename}
                </h3>
                {showAuthor && photo.author && (
                    <p className="text-sm text-gray-500 mb-2">By {photo.author}</p>
                )}
                {showActions && renderActions()}
            </div>
        </div>
    );
};

export default PhotoCard;