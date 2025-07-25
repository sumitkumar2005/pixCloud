import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhotoCard from '../components/common/PhotoCard';
import Search from '../components/common/Search';
import { filterPhotosByDate } from '../utils/dateUtils';
import PhotoModal from '../components/common/PhotoModal';
import { useAuth } from '../context/AuthContext';

const AllPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/all-photos');
                setPosts(res.data);
                setFilteredPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        let filtered = [...posts];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply date filter
        filtered = filterPhotosByDate(filtered, dateFilter);

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.uploadDate || a.uploadedAt);
            const dateB = new Date(b.uploadDate || b.uploadedAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredPosts(filtered);
    }, [posts, searchTerm, dateFilter, sortOrder]);

    const handleActionClick = (action, photo) => {
        switch (action) {
            case 'like':
                // Handle like action
                break;
            case 'view':
                setSelectedPhoto(photo);
                break;
            case 'share':
                // Handle share action
                break;
            case 'download':
                window.open(`http://localhost:5000/uploads/${photo.filename}`, '_blank');
                break;
            default:
                break;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Search
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
            />

            <div className={viewMode === 'grid' ?
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :
                'space-y-6'
            }>
                {filteredPosts.map(photo => (
                    <PhotoCard
                        key={photo._id}
                        photo={photo}
                        viewMode={viewMode}
                        onPhotoClick={() => setSelectedPhoto(photo)}
                        onActionClick={handleActionClick}
                        showAuthor={true}
                    />
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No photos found.
                </div>
            )}
            {selectedPhoto && (
                <PhotoModal
                    photo={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                    userId={user?._id}
                />
            )}

        </div>
    );
};

export default AllPosts;