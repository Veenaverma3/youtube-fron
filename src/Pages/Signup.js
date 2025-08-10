 import React, { useState } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../Component/url';

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
    uploadData.append('upload_preset', 'youtube-clone');
    uploadData.append('cloud_name', 'dbgekulid');

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
      const profilePicUrl = await handleImageUpload();
      const updatedFormData = { ...formData, profilePic: profilePicUrl };

      const response = await axios.post(`${url}/auth/signup`, updatedFormData, {
        withCredentials: true,
      });

      toast.success('Signup successful! Redirecting...');
      const user = response.data.user;
        console.log('User signed up:', response.data);
      // Optional: Store minimal info for use in frontend
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userProfilePic", user.profilePic);
      localStorage.setItem("token", response.data.token);

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
      <div className="bg-linear-to-r from-pink-200 via-red-400 to-rose-600 shadow-2xl rounded-xl w-full max-w-fit p-12">
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
              className="w-full border border-red-950 bg-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
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
              className="w-full border  border-red-950 bg-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
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
              className="w-full border  border-red-950 bg-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold text-gray-700 mb-1">About</label>
            <textarea
              value={formData.about}
              onChange={(e) => handleChange(e, 'about')}
              rows="3"
              className="w-full border  border-red-950 bg-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Tell us about your channel"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md py-2 px-2 bg-linear-to-r from-orange-600 via-amber-900 to-amber-950 text-white "
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-2 rounded-md transition disabled:opacity-60 bg-linear-to-r from-gray-800 via-rose-600 to-orange-500 hover:p-2 "
            >
              {isLoading ? 'Signing up...' : 'Signup'}
            </button>

            <Link
              to="/login"
              className="w-full text-center bg-linear-to-r from-gray-800 via-rose-600 to-orange-500 text-white py-2 rounded-md hover:p-2  transition"
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



/* 
exports.signUp = async (req, res) => {
  try {
    const { channelName, userName, password, about, profilePic } = req.body;
    const isExist = await User.findOne({ userName });

    if (isExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      channelName,
      userName,
      password: hashedPassword,
      about,
      profilePic,
    });

    await user.save();

    // 🔐 Create token just like in login
    const token = jwt.sign({ userId: user._id }, 'veena', {
      expiresIn: "90d",
    });

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // ✅ Return token and user info
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        channelName: user.channelName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

*/