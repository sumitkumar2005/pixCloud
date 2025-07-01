import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/all-photos');
                setPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading posts...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">🌐 All Posts</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <img
                            src={`http://localhost:5000/uploads/${post.filename}`}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="font-semibold text-xl">{post.title || 'Untitled'}</h2>
                            <p className="text-gray-600 text-sm mt-1">{post.description || 'No description'}</p>
                            <p className="text-xs text-gray-400 mt-2">By: {post.author || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">{new Date(post.uploadedAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPosts;
