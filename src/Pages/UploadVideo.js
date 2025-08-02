 import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'All',
    videoFile: null,
    thumbnail: null,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('videoFile', formData.videoFile);
      data.append('thumbnail', formData.thumbnail);

      const res = await axios.post('http://localhost:4000/video/upload', data, {
        withCredentials: true, // required for cookies
      });

      console.log('Upload successful:', res.data);

      // ✅ Navigate to home after successful upload
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      {/* your form inputs here */}

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
  );
};

export default UploadVideo;
