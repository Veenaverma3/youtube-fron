 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./Component/Navbar/Navbar";
import VideoPage from "./Pages/Video/Video";
 import UploadVideo from "./Pages/UploadVideo";
import SideNavbar from "./Component/Sidenavbar/SideNavbar";
import CategoryFilter from "./Component/HomePage/CategoryFilter";
import HomePage from "./Component/HomePage/HomePage";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import EditVideo from "./Pages/Video/Editvideo";


function App() {
  const [sideNavbar, setSideNavbar] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const setSideNavbarFunc = (value) => {
    setSideNavbar(value);
  };

  const handleUserAction = (type) => {
    if (type === "logout") {
      console.log("User wants to logout");
    }
  };

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar always on top */}
        <Navbar
          setSideNavbarFunc={setSideNavbarFunc}
          sideNavbar={sideNavbar}
          handleUserAction={handleUserAction}
        />

        {/* Main section: Sidebar + Content */}
        <div className="flex flex-grow overflow-hidden">
          {sideNavbar && <SideNavbar />} {/* Sidebar on the left */}

          <div className="flex flex-col flex-grow overflow-y-auto">
            {/* CategoryFilter at the top of content */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Routes below the filter */}
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    selectedCategory={selectedCategory}
                    sideNavbar={sideNavbar}
                  />
                }
              />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/profile/:userId" element={<Profile/>}/>
              <Route path="/login" element={<Login/>}/>
             <Route path="/signup" element={<Signup/>}/>
              <Route path="/upload" element={<UploadVideo />} />
                     </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
