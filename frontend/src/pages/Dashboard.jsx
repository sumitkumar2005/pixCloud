import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Camera, TrendingUp, Users, Award } from 'lucide-react';
import Search from '../components/common/Search.jsx';
import PhotoCard from "../components/common/photoCard.jsx";
function Dashboard() {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const recommendedPhotos = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
            photographer: "Alex Chen",
            likes: 1247,
            title: "Mountain Sunrise"
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=400&auto=format&fit=crop",
            photographer: "Sarah Kim",
            likes: 892,
            title: "Ocean Waves"
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
            photographer: "Mike Torres",
            likes: 2156,
            title: "Forest Path"
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            photographer: "Emma Davis",
            likes: 674,
            title: "City Lights"
        }
    ];

    const stats = [
        { icon: Camera, label: "Photos", value: "1,234", color: "text-blue-500" },
        { icon: Heart, label: "Likes", value: "15.2K", color: "text-red-500" },
        { icon: Users, label: "Followers", value: "892", color: "text-green-500" },
        { icon: TrendingUp, label: "Views", value: "45.8K", color: "text-purple-500" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Header */}
            <div className="bg-white  top-0 ">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening with your photos.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Featured Photo Section */}
            <div className="relative w-full">
                {/* Photo Container */}
                <div className="relative group overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1749838065282-32db54bed154?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Best Photo of the Week"
                        className="w-full h-[70vh] object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full px-6 sm:px-12 lg:px-16 pb-12">
                            <div className="max-w-4xl">
                                {/* Award badge */}
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-500/30">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        <span className="text-yellow-200 font-medium text-sm">Photo of the Week</span>
                                    </div>
                                </div>

                                {/* Title and description */}
                                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                                    Stunning Landscape
                                </h2>
                                <p className="text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
                                    A breathtaking capture that showcases the raw beauty of nature at its finest moment.
                                </p>

                                {/* Stats and photographer info */}
                                <div className="flex flex-wrap items-center gap-6 mb-8">
                                    <div className="flex items-center space-x-2 text-gray-200">
                                        <span className="text-sm">by</span>
                                        <span className="font-semibold">Photography Team</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-200">
                                        <Heart size={18} className="text-red-400" />
                                        <span className="font-semibold">2.1K</span>
                                    </div>
                                    <div className="text-gray-300 text-sm">
                                        Featured this week
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setLiked(!liked)}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                            liked
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                        } hover:scale-105`}
                                    >
                                        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                                        <span className="font-medium">Like</span>
                                    </button>
                                    <button
                                        onClick={() => setBookmarked(!bookmarked)}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                            bookmarked
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                        } hover:scale-105`}
                                    >
                                        <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                                        <span className="font-medium">Save</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                                        <Share2 size={20} />
                                        <span className="font-medium">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Search bar */}
            <Search/>


            {/* Recommended Photos */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended for You</h2>
                        <p className="text-gray-600">Discover amazing photos curated just for you</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedPhotos.map((photo) => (
                            <PhotoCard key={photo.id} photo={photo} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;