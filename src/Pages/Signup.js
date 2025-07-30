 import React, { useState } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    channelName: '',
    userName: '',
    password: '',
    about: '',
    profilePic: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return '';

    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('upload_preset', 'youtube-clone'); // Replace with your preset
    uploadData.append('cloud_name', 'dbgekulid'); // Replace with your Cloudinary name

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dbgekulid/image/upload", {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let profilePicUrl = await handleImageUpload();

      const updatedFormData = { ...formData, profilePic: profilePicUrl };

      const response = await axios.post('http://localhost:4000/auth/signup', updatedFormData);

      toast.success('Signup successful!');
      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userProfilePic", user.profilePic);

      setTimeout(() => navigate(`/profile/${user._id}`), 2000);
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-28 mb-6 flex justify-center w-fit items-center m-auto px-4">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-fit p-12">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <YouTubeIcon sx={{ fontSize: 36, color: 'red' }} />
          <h1 className="text-2xl font-bold text-gray-800">Signup</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-bold text-gray-700 mb-1">Channel Name</label>
            <input
              type="text"
              value={formData.channelName}
              onChange={(e) => handleChange(e, 'channelName')}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter channel name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => handleChange(e, 'userName')}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange(e, 'password')}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold text-gray-700 mb-1">About</label>
            <textarea
              value={formData.about}
              onChange={(e) => handleChange(e, 'about')}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Tell us about your channel"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md py-2 px-2 bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition disabled:opacity-60"
            >
              {isLoading ? 'Signing up...' : 'Signup'}
            </button>

            <Link
              to="/login"
              className="w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
