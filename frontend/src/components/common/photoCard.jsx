import React from 'react';
import {Heart} from "lucide-react";

function PhotoCard({photo}) {
    return (
        <div>
            <div key={photo.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                    <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="p-3 rounded-full bg-white/90 text-gray-700 hover:scale-110 hover:bg-white transition-all duration-200 backdrop-blur-sm shadow-lg">
                            <Heart size={18} />
                        </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="text-white">
                            <h4 className="font-semibold text-lg">{photo.title}</h4>
                            <p className="text-sm text-gray-200">by {photo.photographer}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 px-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-lg">
                        {photo.title}
                    </h4>
                    <p className="text-gray-600 mb-2">by {photo.photographer}</p>
                    <div className="flex items-center space-x-2">
                        <Heart size={16} className="text-red-500" />
                        <span className="text-gray-600 font-medium">{photo.likes.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoCard;