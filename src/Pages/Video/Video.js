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
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [allVideos, setAllVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, commentsRes, allVideosRes, userRes] = await Promise.all([
       axios.get(`${url}/api/getvideobyid/${id}`),
axios.get(`${url}/commentapi/comments/${id}`),
axios.get(`${url}/api/allvideo`),
axios.get(`${url}/auth/me`, { withCredentials: true }),
        ]);

        setVideo(videoRes.data.video);
        setLikeCount(videoRes.data.video.likes || 0);
        setComments(commentsRes.data.comments);
        setAllVideos(allVideosRes.data);
        setCurrentUser(userRes.data.user);
      } catch (err) {
        console.error("Error loading video or user data", err);
      }
    };

    fetchData();
  }, [id]);

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(
  `${url}/commentapi/comment`,
  { video: video._id, message },
  { withCredentials: true }
);
      setMessage("");
      const res = await axios.get(`${url}/commentapi/comments/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      alert("Please login to comment.");
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

  if (!video) return <div className="p-6 text-center text-gray-600">Loading video...</div>;

  const suggestedVideos = allVideos.filter((v) => v._id !== video._id);
  const isOwner = currentUser?._id === video.user?._id;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:space-x-6">
      <div className="w-full lg:w-[70%] space-y-6">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video className="w-full h-full object-contain" src={video.videoFile} controls autoPlay />
        </div>

      <div className="mt-4 space-y-2">
  {/* Video Title */}
  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{video.title}</h2>

  {/* Uploader Info */}
  <div className="flex items-center justify-between flex-wrap gap-3">
    <div className="flex items-center gap-3">
      <img
        src={video.user?.profilePic || "/default-profile.png"}
        alt="profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-md font-medium text-gray-800">{video.user?.channelName || "Unknown User"}</p>
        <p className="text-sm text-gray-500">@{video.user?.userName || "username"}</p>
      </div>
    </div>

    {/* Action Buttons (Like, Dislike, Delete) */}
    <div className="flex gap-3">
      <button
        onClick={() => {
          setLiked((prev) => {
            const newLiked = !prev;
            if (newLiked && disliked) setDisliked(false);
            setLikeCount((count) => count + (newLiked ? 1 : -1));
            return newLiked;
          });
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm ${
          liked ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700"
        }`}
      >
        <ThumbUpOutlined fontSize="small" /> Like ({likeCount})
      </button>

      <button
        onClick={() => {
          setDisliked(!disliked);
          if (liked) {
            setLiked(false);
            setLikeCount((count) => count - 1);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm ${
          disliked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
        }`}
      >
        <ThumbDownOutlined fontSize="small" /> Dislike
      </button>

      {isOwner && (
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 rounded shadow-sm bg-red-200 text-red-700 hover:bg-red-300 transition"
        >
          <DeleteOutline fontSize="small" /> Delete
        </button>
      )}
    </div>
  </div>
</div>


        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{video.description}</p>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleComment}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm text-gray-700 font-semibold">{comment.user?.userName}</p>
                <p className="text-gray-600">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Videos */}
      <div className="w-full lg:w-[30%] mt-8 lg:mt-0">
        <SuggestedVideos videos={suggestedVideos} />
      </div>
    </div>
  );
};

export default VideoPage;
