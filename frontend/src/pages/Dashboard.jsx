import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Camera, TrendingUp, Users, Award, Plus, Grid, List } from 'lucide-react';
import Search from '../components/common/Search.jsx';
import PhotoCard from "../components/common/PhotoCard.jsx";

function Dashboard() {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const formatRelativeTime = (date) => {
        const now = new Date();
        const photoDate = new Date(date);
        const diffInHours = Math.floor((now - photoDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return photoDate.toLocaleDateString();
    };

    const recommendedPhotos = [
        {
            _id: 1,
            filename: "mountain-sunrise.jpg",
            title: "Mountain Sunrise",
            description: "Beautiful mountain sunrise captured at dawn",
            author: "Alex Chen",
            uploadDate: new Date().toISOString(),
            likes: [1, 2, 3, 4, 5],
            views: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
            _id: 2,
            filename: "ocean-waves.jpg",
            title: "Ocean Waves",
            description: "Mesmerizing ocean waves at sunset",
            author: "Sarah Kim",
            uploadDate: new Date().toISOString(),
            likes: [1, 2, 3],
            views: [1, 2, 3, 4, 5, 6]
        },
        {
            _id: 3,
            filename: "forest-path.jpg",
            title: "Forest Path",
            description: "A serene path through the forest",
            author: "Mike Torres",
            uploadDate: new Date().toISOString(),
            likes: [1, 2],
            views: [1, 2, 3, 4]
        },
        {
            _id: 4,
            filename: "city-lights.jpg",
            title: "City Lights",
            description: "Urban nightscape with stunning city lights",
            author: "Emma Davis",
            uploadDate: new Date().toISOString(),
            likes: [1, 2, 3, 4, 5, 6, 7, 8],
            views: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
    ];

    const stats = [
        { icon: Camera, label: "Photos", value: "1,234", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
        { icon: Heart, label: "Likes", value: "15.2K", color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10" },
        { icon: Users, label: "Followers", value: "892", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10" },
        { icon: TrendingUp, label: "Views", value: "45.8K", color: "from-purple-500 to-violet-500", bg: "bg-purple-500/10" }
    ];

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const handleActionClick = (action, photo) => {
        console.log(`${action} clicked for photo:`, photo);
        // Handle actions like like, share, download, etc.
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12 slide-up">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            Welcome to
                            <span className="text-gradient block">PixCloud</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Discover, share, and celebrate amazing photography from creators around the world
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className={`glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`} style={{filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'}} />
                                </div>
                                <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                                <div className="text-black font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Search Section */}
                    <div className="max-w-2xl mx-auto mb-12 slide-up" style={{animationDelay: '0.4s'}}>
                        <Search />
                    </div>
                </div>
            </div>

            {/* Featured Photo Section */}
            <div className="relative mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass rounded-3xl overflow-hidden shadow-2xl slide-up" style={{animationDelay: '0.6s'}}>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1749838065282-32db54bed154?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Featured Photo"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white font-medium">Featured Photo</span>
                                    </div>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2">Breathtaking Landscape</h2>
                                <p className="text-white/80 text-lg mb-4 max-w-2xl">
                                    Captured in the golden hour, this stunning landscape showcases nature's incredible beauty
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">JD</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">John Doe</p>
                                            <p className="text-white/60 text-sm">Professional Photographer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photos Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Trending Photos</h2>
                        <p className="text-white/70">Discover the most popular photos from our community</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="glass rounded-xl p-1 flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === 'grid' 
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === 'list' 
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Photos Grid */}
                <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                }`}>
                    {recommendedPhotos.map((photo, index) => (
                        <div key={photo._id} style={{animationDelay: `${index * 0.1}s`}}>
                            <PhotoCard
                                photo={photo}
                                viewMode={viewMode}
                                onPhotoClick={handlePhotoClick}
                                onActionClick={handleActionClick}
                                showActions={true}
                                showAuthor={true}
                            />
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-white/80" />
                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Share Your Story?</h3>
                        <p className="text-white/70 mb-6">
                            Upload your photos and join our community of passionate photographers
                        </p>
                        <button className="btn-primary flex items-center gap-2 mx-auto">
                            <Plus size={20} />
                            Upload Your First Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;