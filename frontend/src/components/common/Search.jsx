import React from 'react';
import { Search as SearchIcon, Grid, List } from 'lucide-react';

const Search = ({
    searchTerm,
    onSearchChange,
    dateFilter,
    onDateFilterChange,
    viewMode,
    onViewModeChange,
    sortOrder,
    onSortOrderChange
}) => {
    return (
        <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search photos..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={dateFilter}
                        onChange={(e) => onDateFilterChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
