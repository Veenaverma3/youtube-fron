 // SuggestedVideos.js
import React from 'react';
import { Link } from 'react-router-dom';

const SuggestedVideos = ({ videos = [] }) => {
  const suggested = videos.slice(0, 5); // limit to top 5

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold mb-2">Suggested Videos</h3>
      {suggested.map((video) => (
        <Link
          to={`/video/${video._id}`}
          key={video._id}
          className="flex items-start space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-20 object-cover rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-thumbnail.jpg';
            }}
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold leading-snug line-clamp-2">{video.title}</h4>
            <p className="text-xs text-gray-600">{video.user?.channelName || 'Unknown Channel'}</p>
            <p className="text-xs text-gray-500">{video.like || '0 like'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;
