import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Filter, FileImage, Star, Eye, Heart, Share2, Grid, List, Search, Download } from 'lucide-react';

const MyPosts = ({ token }) => {
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [dateFilter, setDateFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/photos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPhotos(res.data);
                setFilteredPhotos(res.data);
            } catch (err) {
                console.error('Error fetching user photos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [token]);

    // Filter and sort photos
    useEffect(() => {
        let filtered = [...photos];
        const now = new Date();

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(photo =>
                photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (photo.title && photo.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply date filter
        if (dateFilter === 'today') {
            filtered = filtered.filter(photo => {
                const photoDate = new Date(photo.uploadDate);
                return photoDate.toDateString() === now.toDateString();
            });
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(photo => new Date(photo.uploadDate) >= weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            filtered = filtered.filter(photo => new Date(photo.uploadDate) >= monthAgo);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.uploadDate);
            const dateB = new Date(b.uploadDate);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredPhotos(filtered);
    }, [photos, dateFilter, sortOrder, searchTerm]);

    const getMostRecentPhoto = () => {
        if (photos.length === 0) return null;
        return photos.reduce((latest, photo) =>
            new Date(photo.uploadDate) > new Date(latest.uploadDate) ? photo : latest
        );
    };

    const formatRelativeTime = (date) => {
        const now = new Date();
        const photoDate = new Date(date);
        const diffInHours = Math.floor((now - photoDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return photoDate.toLocaleDateString();
    };

    const recentPhoto = getMostRecentPhoto();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-xl w-96 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="w-full h-56 bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        <FileImage className="inline-block mr-4 text-purple-600" size={48} />
                        My Photo Gallery
                    </h1>
                    <p className="text-gray-600 text-xl font-medium">Your beautiful memories, organized and styled</p>
                </div>

                {/* Recent Photo Highlight */}
                {recentPhoto && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-10 border border-purple-100 hover:shadow-3xl transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 mr-3">
                                <Star className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Latest Upload</h2>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                            <div className="relative group">
                                <img
                                    src={`http://localhost:5000/uploads/${recentPhoto.filename}`}
                                    alt={recentPhoto.filename}
                                    className="w-64 h-64 object-cover rounded-2xl shadow-xl border-4 border-purple-200 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    onClick={() => setSelectedPhoto(recentPhoto)}
                                />
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    Latest
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                                    <Eye className="text-white" size={32} />
                                </div>
                            </div>
                            <div className="text-center lg:text-left flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{recentPhoto.title || recentPhoto.filename}</h3>
                                {recentPhoto.description && (
                                    <p className="text-gray-600 text-lg mb-4">{recentPhoto.description}</p>
                                )}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <div className="flex items-center bg-purple-100 px-4 py-2 rounded-full">
                                        <Clock className="mr-2 text-purple-600" size={18} />
                                        <span className="text-purple-700 font-medium">{formatRelativeTime(recentPhoto.uploadDate)}</span>
                                    </div>
                                    <div className="text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
                                        {new Date(recentPhoto.uploadDate).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <Filter className="text-gray-600" size={20} />
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 font-medium"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="text-gray-600" size={20} />
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 font-medium"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid' ? 'bg-white shadow-md text-purple-600' : 'text-gray-600 hover:text-purple-600'
                                    }`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list' ? 'bg-white shadow-md text-purple-600' : 'text-gray-600 hover:text-purple-600'
                                    }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="text-4xl font-bold">{photos.length}</div>
                        <div className="text-purple-100 font-medium">Total Photos</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="text-4xl font-bold">{filteredPhotos.length}</div>
                        <div className="text-blue-100 font-medium">Filtered Results</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="text-4xl font-bold">
                            {photos.filter(p => {
                                const photoDate = new Date(p.uploadDate);
                                const today = new Date();
                                return photoDate.toDateString() === today.toDateString();
                            }).length}
                        </div>
                        <div className="text-green-100 font-medium">Today's Uploads</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="text-4xl font-bold">
                            {photos.filter(p => new Date(p.uploadDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                        </div>
                        <div className="text-orange-100 font-medium">This Week</div>
                    </div>
                </div>

                {/* Photo Grid/List */}
                {filteredPhotos.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 max-w-lg mx-auto border border-gray-100">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <FileImage className="text-gray-400" size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-600 mb-4">No images found</h3>
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? `No images match "${searchTerm}"` :
                                    dateFilter === 'all' ? 'No images uploaded yet.' :
                                        'No images found for the selected time period.'}
                            </p>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo._id}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer border border-gray-100"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`http://localhost:5000/uploads/${photo.filename}`}
                                        alt={photo.filename}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-700">
                                        {formatRelativeTime(photo.uploadDate)}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex gap-2">
                                            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                                <Heart size={16} />
                                            </button>
                                            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                                <Share2 size={16} />
                                            </button>
                                            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-800 mb-2 text-lg truncate">
                                        {photo.title || photo.filename}
                                    </h3>
                                    {photo.description && (
                                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{photo.description}</p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Clock className="mr-1" size={14} />
                                            {new Date(photo.uploadDate).toLocaleDateString()}
                                        </div>
                                        {photo.author && (
                                            <span className="text-purple-600 font-medium">by {photo.author}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo._id}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="relative md:w-80 h-64 md:h-48 overflow-hidden">
                                        <img
                                            src={`http://localhost:5000/uploads/${photo.filename}`}
                                            alt={photo.filename}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-700">
                                            {formatRelativeTime(photo.uploadDate)}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                            {photo.title || photo.filename}
                                        </h3>
                                        {photo.description && (
                                            <p className="text-gray-600 mb-4 text-lg">{photo.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 items-center justify-between">
                                            <div className="flex items-center text-gray-500">
                                                <Clock className="mr-2" size={16} />
                                                {new Date(photo.uploadDate).toLocaleString()}
                                            </div>
                                            {photo.author && (
                                                <span className="text-purple-600 font-medium text-lg">by {photo.author}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-xl transition-colors">
                                                <Eye size={16} />
                                                View
                                            </button>
                                            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                                                <Heart size={16} />
                                                Like
                                            </button>
                                            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                                                <Share2 size={16} />
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Photo Modal */}
                {selectedPhoto && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                        <div className="max-w-5xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                <img
                                    src={`http://localhost:5000/uploads/${selectedPhoto.filename}`}
                                    alt={selectedPhoto.filename}
                                    className="w-full max-h-[70vh] object-contain"
                                />
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {selectedPhoto.title || selectedPhoto.filename}
                                </h3>
                                {selectedPhoto.description && (
                                    <p className="text-gray-600 mb-4">{selectedPhoto.description}</p>
                                )}
                                <div className="flex items-center justify-between text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="mr-2" size={16} />
                                        {new Date(selectedPhoto.uploadDate).toLocaleString()}
                                    </div>
                                    {selectedPhoto.author && (
                                        <span className="text-purple-600 font-medium">by {selectedPhoto.author}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;