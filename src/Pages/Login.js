 import React, { useState } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { url } from '../Component/url';
const Login = ({ setShowLogin }) => {
  const [loginField, setLoginField] = useState({ userName: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e, name) => {
    setLoginField({ ...loginField, [name]: e.target.value });
  };

  const handleCancel = () => {
    if (setShowLogin) setShowLogin(false);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${url}/auth/login`, loginField, {
        withCredentials: true,
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userProfilePic", user.profilePic);

      toast.success('Login successful!');

      if (setShowLogin) setShowLogin(false);

      // Navigate to profile after short delay
      setTimeout(() => navigate(`/profile/${user._id}`), 1500);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="mt-28 mb-6 flex justify-center w-fit items-center m-auto px-4">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-fit p-10 sm:p-16">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <YouTubeIcon sx={{ fontSize: 36, color: 'red' }} />
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-bold font-sans text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={loginField.userName}
            onChange={(e) => handleChange(e, 'userName')}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-bold font-sans text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={loginField.password}
            onChange={(e) => handleChange(e, 'password')}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLogin}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition disabled:opacity-60"
          >
            Login
          </button>

          <Link
            to="/signup"
            className="w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition"
            onClick={handleCancel}
          >
            Signup
          </Link>

          <button
            onClick={handleCancel}
            className="w-full bg-gray-200 text-gray-600 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
