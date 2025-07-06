export const formatRelativeTime = (date) => {
    const now = new Date();
    const photoDate = new Date(date);
    const diffInHours = Math.floor((now - photoDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return photoDate.toLocaleDateString();
};

export const filterPhotosByDate = (photos, dateFilter) => {
    if (!dateFilter || dateFilter === 'all') return photos;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return photos.filter(photo => {
        const photoDate = new Date(photo.uploadDate || photo.uploadedAt);
        if (dateFilter === 'today') {
            return photoDate >= today;
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return photoDate >= weekAgo;
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return photoDate >= monthAgo;
        }
        return true;
    });
};
