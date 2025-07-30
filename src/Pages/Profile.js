import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/${userId}/channel`);
        setUser(res.data.user);
        setVideos(res.data.videos);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">User not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="flex mt-10 flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Banner */}
      <div className="w-full h-36 sm:h-48 bg-gradient-to-r from-purple-600 to-pink-500 shadow-md" />

      {/* Profile Info */}
      <div className="px-6 sm:px-10 -mt-16 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        <img
          src={user.profilePic || '/default-avatar.png'}
          alt="avatar"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold capitalize text-gray-900">{user.channelName}</h2>
          <p className="text-md text-gray-700 mt-1">
            Username: <span className="font-medium capitalize ">{user.userName}</span>
          </p>
          <p className="text-md text-indigo-600 mt-1">{videos.length} Published Videos</p>
          <p className="mt-3 text-gray-800 text-sm sm:text-base leading-relaxed max-w-3xl">
            {user.about || "This channel hasn't provided a description yet."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-start px-6 sm:px-10 mt-6 border-b">
        <button className="py-2 px-4 text-sm sm:text-base text-black font-semibold border-b-2 border-black">
          Videos
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 sm:px-10 py-10">
        {videos.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden block"
          >
            <img
              src={video.thumbnail || '/default-thumbnail.jpg'}
              alt={video.title}
              className="w-full h-44 sm:h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-thumbnail.jpg';
              }}
            />
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(video.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;
