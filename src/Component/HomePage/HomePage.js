import React, { useEffect, useState } from "react";
 import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = ({ selectedCategory }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:4000/api/allvideo")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      :videos.filter((video) =>
  video.category.toLowerCase() === selectedCategory.toLowerCase()
);

  const getValidImage = (url, fallback) => {
    if (!url || !url.startsWith("http")) return fallback;
    return url;
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));

  return (
    <div className="p-4 grid gap-6 sm:grid-cols-2 md:grid-cols-4 transition-all duration-300">
      {loading ? (
        <p className="text-center col-span-full">Loading videos...</p>
      ) : filteredVideos.length === 0 ? (
        <p className="text-center col-span-full text-gray-500">
          No videos found in this category.
        </p>
      ) : (
        filteredVideos.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="cursor-pointer"
          >
            <div className="relative  rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className=" w-full h-44 sm:h-44 md:h-48 lg:h-52 xl:h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-thumbnail.jpg";
                }}
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                {video.duration || "10:00"}
              </span>
            </div>

            <div className="flex mt-3 space-x-3">
              <img
                src={getValidImage(
                  video.user?.profilePic,
                  "/default-avatar.png"
                )}
                alt={video.user?.channelName || "Channel"}
                className="w-9 h-9 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {video.user?.channelName || "Unknown Channel"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(video.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default HomePage;
