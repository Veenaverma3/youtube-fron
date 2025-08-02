 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Component/url";

import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import SuggestedVideos from "./Suggestedvideo";

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [allVideos, setAllVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔁 Central fetch for video + comments
 const fetchVideo = async () => {
  try {
    const [videoRes, commentsRes] = await Promise.all([
      axios.get(`${url}/api/getvideobyid/${id}`, { withCredentials: true }),
      axios.get(`${url}/commentapi/comments/${id}`, { withCredentials: true }),
    ]);
    setVideo(videoRes.data.video);
    setComments(commentsRes.data.comments);
  } catch (err) {
    console.error("Failed to load video or comments", err);
  }
};
useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchVideo();
      const [userRes, allVideosRes] = await Promise.all([
        axios.get(`${url}/auth/me`, { withCredentials: true }),
        axios.get(`${url}/api/allvideo`),
      ]);
      setCurrentUser(userRes.data.user);
      setAllVideos(allVideosRes.data);
    } catch (err) {
      console.error("User or video list fetch error", err);
    }
  };

  fetchData();
}, [id]);

  // 🧠 Helpers
  const isOwner = currentUser?._id === video?.user?._id;
 const suggestedVideos = video ? allVideos.filter((v) => v._id !== video._id) : [];

  const handleLike = async () => {
    try {
      await axios.put(`${url}/api/like/${video._id}`, {}, { withCredentials: true });
      fetchVideo();
    } catch (err) {
      alert("Login to like videos.");
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`${url}/api/dislike/${video._id}`, {}, { withCredentials: true });
      fetchVideo();
    } catch (err) {
      alert("Login to dislike videos.");
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(
        `${url}/commentapi/comment`,
        { message,videoId: video._id },
        { withCredentials: true }
      );
      setMessage("");
      fetchVideo();
    } catch (err) {
      console.log(err.response?.data|| err.message);
      alert("Login to comment.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`${url}/api/delete/${video._id}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  if (!video) return <div className="p-6 text-center">Loading video...</div>;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:space-x-6">
      <div className="w-full lg:w-[70%] space-y-6">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video className="w-full h-full object-contain" src={video.videoFile} controls autoPlay />
        </div>

        <div className="mt-4 space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{video.title}</h2>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <img
                src={video.user?.profilePic || "/default-profile.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-md font-medium text-gray-800">{video.user?.channelName || "Unknown"}</p>
                <p className="text-sm text-gray-500">@{video.user?.userName || "username"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-blue-100 text-gray-700"
              >
                <ThumbUpOutlined fontSize="small" /> Like ({video.likes})
              </button>
              <button
                onClick={handleDislike}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-red-100 text-gray-700"
              >
                <ThumbDownOutlined fontSize="small" /> Dislike
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-red-200 text-red-700 hover:bg-red-300"
                >
                  <DeleteOutline fontSize="small" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{video.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleComment} className="bg-blue-600 text-white px-4 py-2 rounded">
              Post
            </button>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm font-semibold text-gray-700">{comment.user?.userName}</p>
                <p className="text-gray-600">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%] mt-8 lg:mt-0">
        <SuggestedVideos videos={suggestedVideos} />
      </div>
    </div>
  );
};

export default VideoPage;
