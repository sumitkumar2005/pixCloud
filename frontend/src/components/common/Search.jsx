import React, { useState } from 'react';
import { Search as SearchIcon, Filter, X, Calendar } from 'lucide-react';

const Search = ({
    searchTerm = '',
    onSearchChange = () => {},
    dateFilter = '',
    onDateFilterChange = () => {},
    sortOrder = 'newest',
    onSortOrderChange = () => {}
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Main Search Bar */}
            <div className="glass-content rounded-2xl p-4 mb-4 border border-white/30">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for amazing photos..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-16 py-4 bg-white/90 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200 text-lg"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                            showFilters 
                                ? 'bg-purple-500 text-white' 
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="glass-content rounded-2xl p-6 border border-white/30 slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date Filter */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date Range
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => onDateFilterChange(e.target.value)}
                                className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
                            >
                                <option value="">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-sm font-medium">Sort By</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => onSortOrderChange(e.target.value)}
                                className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="trending">Trending</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-sm font-medium">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
                            >
                                <option value="">All Categories</option>
                                <option value="nature">Nature</option>
                                <option value="portrait">Portrait</option>
                                <option value="street">Street</option>
                                <option value="landscape">Landscape</option>
                                <option value="abstract">Abstract</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex gap-3 mt-6">
                        <button className="btn-primary flex-1">
                            Apply Filters
                        </button>
                        <button className="btn-secondary">
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
                {['Popular', 'Recent', 'Nature', 'Portrait', 'Landscape'].map((tag) => (
                    <button
                        key={tag}
                        className="px-4 py-2 glass-content rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/90 transition-all duration-200 text-sm font-medium border border-white/20"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Search;
