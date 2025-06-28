import React from 'react';

function Search(props) {
    return (
        <div>
            <div className="flex flex-wrap items-center gap-4 mt-4">
                <input
                    type="text"
                    placeholder="Search photos..."
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 rounded-md border border-gray-300">
                    <option>All Categories</option>
                    <option>Landscape</option>
                    <option>Portrait</option>
                    <option>Urban</option>
                </select>
                <select className="px-4 py-2 rounded-md border border-gray-300">
                    <option>Sort by</option>
                    <option>Most Liked</option>
                    <option>Newest</option>
                </select>
            </div>

        </div>
    );
}

export default Search;