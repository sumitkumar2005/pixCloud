import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhotoCard from '../components/common/PhotoCard';
import Search from '../components/common/Search';
import { filterPhotosByDate } from '../utils/dateUtils';

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

    useEffect(() => {
        let filtered = [...photos];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(photo =>
                photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (photo.title && photo.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

        setFilteredPhotos(filtered);
    }, [photos, searchTerm, dateFilter, sortOrder]);

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
                {filteredPhotos.map(photo => (
                    <PhotoCard
                        key={photo._id}
                        photo={photo}
                        viewMode={viewMode}
                        onPhotoClick={() => setSelectedPhoto(photo)}
                        onActionClick={handleActionClick}
                    />
                ))}
            </div>

            {filteredPhotos.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No photos found.
                </div>
            )}
        </div>
    );
};

export default MyPosts;