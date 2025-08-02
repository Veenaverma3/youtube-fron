 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Component/url";
import { DeleteOutline } from "@mui/icons-material";
import SuggestedVideos from "./Suggestedvideo";

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [allVideos, setAllVideos] = useState([]);

  const fetchVideo = async () => {
    try {
      // Fetch current video
      const videoRes = await axios.get(`${url}/api/getvideobyid/${id}`);
      setVideo(videoRes.data.video);

      // Fetch comments
      const commentsRes = await axios.get(`${url}/commentapi/getcomments/${id}`);
      setComments(commentsRes.data.comments);
    } catch (err) {
      console.error("Error fetching video or comments", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch video and comments
        await fetchVideo();

        // Fetch current user and all videos
        const [userRes, allVideosRes] = await Promise.all([
          axios.get(`${url}/auth/me`, { withCredentials: true }),
          axios.get(`${url}/api/allvideo`)
        ]);

        setCurrentUser(userRes.data.user);
        setAllVideos(allVideosRes.data);
      } catch (err) {
        console.error("User or suggested videos fetch failed", err);
      }
    };

    if (id) fetchData();
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
      fetchVideo(); // Refresh comments
    } catch {
      alert("Login to comment.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`${url}/api/delete/${video._id}`);
      navigate("/");
    } catch {
      alert("Failed to delete video.");
    }
  };

  if (!video) return <div className="p-6 text-center">Loading video...</div>;

  const suggestedVideos = allVideos.filter((v) => v._id !== video._id);
  const isOwner = currentUser?._id === video.user?._id;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:space-x-6">
      <div className="w-full lg:w-[70%] space-y-6">
        {/* Video player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-contain"
            src={video.videoFile}
            controls
            autoPlay
          />
        </div>

        {/* Title and uploader info */}
        <h2 className="text-2xl font-semibold">{video.title}</h2>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img
              src={video.user?.profilePic || "/default-profile.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{video.user?.channelName}</p>
              <p className="text-sm text-gray-500">@{video.user?.userName}</p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 rounded bg-red-200 text-red-700 hover:bg-red-300"
            >
              <DeleteOutline fontSize="small" /> Delete
            </button>
          )}
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-md font-medium mb-2">Description</h3>
          <p className="text-gray-700">{video.description}</p>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-lg font-semibold mb-2 mt-6">Comments</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleComment}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post
            </button>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm font-semibold text-gray-700">
                  {comment.user?.userName}
                </p>
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
