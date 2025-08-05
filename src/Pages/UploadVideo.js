 import React, { useState, useEffect } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../Component/url';

const CLOUD_NAME = 'dbgekulid';
const UPLOAD_PRESET = 'youtube-clone';

const UploadVideo = () => {
  const [inputField, setInputField] = useState({
    videoTitle: '',
    description: '',
    category: '',
    videoFile: null,
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'thumbnail' && file) {
      setPreview(URL.createObjectURL(file));
    }
    setInputField((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const uploadToCloudinary = async (file, type = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
     return data.secure_url;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { videoTitle, description, category, videoFile, thumbnail } = inputField;

    if (!videoTitle || !description || !category || !videoFile || !thumbnail) {
      toast.error('Please fill out all fields and upload both files.');
      return;
    }

    try {
      setUploading(true);

      const videoUrl = await uploadToCloudinary(videoFile, 'video');
      const thumbnailUrl = await uploadToCloudinary(thumbnail, 'image');

    const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
  
    await axios.post(
  `${url}/api/upload`,
  {
    title: videoTitle,
    description,
    category: normalizedCategory,
    videoFile: videoUrl,
    thumbnail: thumbnailUrl
  },
  {
    withCredentials: true
  }
);

      toast.success('🎉 Video uploaded successfully!');
      setInputField({
        videoTitle: '',
        description: '',
        category: '',
        videoFile: null,
        thumbnail: null,
      });
        navigate('/');
      setPreview(null);
     } 
        catch (err) {
       toast.error('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg" onSubmit={handleUpload}>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <YouTubeIcon sx={{ fontSize: 40, color: 'red' }} />
          <h1 className="text-2xl font-bold">Upload Video</h1>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
          <input
            type="text"
            value={inputField.videoTitle}
            onChange={(e) => setInputField({ ...inputField, videoTitle: e.target.value })}
            placeholder="Enter video title"
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={inputField.description}
            onChange={(e) => setInputField({ ...inputField, description: e.target.value })}
            placeholder="Enter video description"
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none resize-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={inputField.category}
            onChange={(e) => setInputField({ ...inputField, category: e.target.value })}
            placeholder="e.g. Education, Music, Comedy"
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Video File */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video File</label>
          <label className="inline-block px-6 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition">
            Choose Video
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleChange(e, 'videoFile')}
              className="hidden"
            />
          </label>
          {inputField.videoFile && (
            <p className="text-sm text-green-600 mt-2">{inputField.videoFile.name}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>
          <label className="inline-block px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition">
            Choose Thumbnail
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(e, 'thumbnail')}
              className="hidden"
            />
          </label>
          {inputField.thumbnail && (
            <p className="text-sm text-blue-600 mt-2">{inputField.thumbnail.name}</p>
          )}
        </div>

        {/* Thumbnail Preview */}
        {preview && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Thumbnail Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Submit and Home buttons */}
        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;
