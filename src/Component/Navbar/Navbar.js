 import React, { useState, useRef, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

const Navbar = ({ setSideNavbarFunc, sideNavbar, handleUserAction }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSideNavbar = () => setSideNavbarFunc(!sideNavbar);

  const handlePopupClick = (type) => {
    setShowLogin(false);
    setShowProfile(false);
    setDropdownOpen(false);

    if (type === "login") {
      window.location.href = "/login";
    }

    if (type === "profile") {
      const userId = localStorage.getItem("userId");
      if (userId) {
        window.location.href = `/profile/${userId}`;
      }
    }

    if (type === "logout") {
      localStorage.clear();
      setUserProfilePic(null);
      setShowLogin(true);
      setShowProfile(false);
      window.location.href = "/";
    }

    if (handleUserAction) handleUserAction(type);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedPic = localStorage.getItem("userProfilePic");

    setShowLogin(!storedUserId);
    setShowProfile(!!storedUserId && !!storedPic);
    setUserProfilePic(storedPic);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-linear-to-r from-orange-200 via-pink-400 to-orange-400 shadow-md sticky top-0 z-50 w-full">
        {/* Left Section */}
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={toggleSideNavbar}
        >
          <MenuIcon />
          <Link to={"/"}>
            <div className="flex items-center space-x-1">
              <YouTubeIcon sx={{ fontSize: "32px", color: "red" }} />
              <span className="text-xl font-semibold tracking-tight hidden sm:inline">
                MyTube
              </span>
            </div>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center space-x-2 flex-1 justify-center max-w-2xl">
          <div className="flex items-center w-full border bg-slate-50 border-gray-300 rounded-md hover:outline-double overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-1 outline-none text-sm"
            />
            <button className="px-4 bg-gray-100">
              <SearchIcon />
            </button>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <KeyboardVoiceIcon />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <div className="md:hidden">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <SearchIcon />
            </button>
          </div>

          <Link to={"/upload"}>
            <VideoCallIcon className="cursor-pointer hidden sm:block" />
          </Link>
          <Link to={"/"}>
            <NotificationsIcon className="cursor-pointer hidden sm:block" />
          </Link>

          {/* Profile avatar */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {userProfilePic ? (
              <img
                src={userProfilePic}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400" />
            )}
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-md shadow-md py-2 w-40 z-50">
              {showProfile && (
                <button
                  onClick={() => handlePopupClick("profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
              )}
              {showLogin ? (
                <button
                  onClick={() => handlePopupClick("login")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => handlePopupClick("logout")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="absolute top-full left-0 w-full bg-white border-t px-4 py-2 flex md:hidden z-40">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 border border-gray-300 px-4 py-2 rounded-l-full outline-none text-sm"
            />
            <button className="px-4 bg-gray-100 rounded-r-full border border-gray-300 border-l-0">
              <SearchIcon />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
