 import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../url";

const HomePage = ({ selectedCategory }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${url}/api/allvideo`)
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) =>
            video.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
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
    <div className="p-4 grid gap-6 sm:grid-cols-2 md:grid-cols-4 transition-all duration-300 ">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh] col-span-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-600">
              Loading videos...
            </p>
          </div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <p className="text-center col-span-full text-gray-500">
          No videos found in this category.
        </p>
      ) : (
        filteredVideos.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="cursor-pointer group"
          >
            <div className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-pink-500">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-44 sm:h-44 md:h-48 lg:h-52 xl:h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-thumbnail.jpg";
                }}
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                {video.duration || "10:00"}
              </span>

              <div className="flex p-3 gap-3">
                <Link
                  to={`/profile/${video.user?._id}`}
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={getValidImage(video.user?.profilePic, "/default-avatar.png")}
                    alt={video.user?.channelName || "Channel"}
                    className="w-9 h-9 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </Link>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-white line-clamp-2">
                    {video.title}
                  </h3>
                  <Link
                    to={`/profile/${video.user?._id}`}
                    className="text-xs text-gray-600 group-hover:text-gray-100 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {video.user?.channelName || "Unknown Channel"}
                  </Link>
                  <p className="text-xs text-gray-500 group-hover:text-gray-200">
                    {formatDate(video.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default HomePage;
