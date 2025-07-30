import React  from 'react';
import SideNavbar from '../../Component/Sidenavbar/SideNavbar';
import HomePage from '../../Component/HomePage/HomePage';



const Home = ({ isSideNavbarVisible }) => {



  return (
    <div className="flex h-full">
      {/* Sidebar on the left */}
      {isSideNavbarVisible && (
        <div className="w-60 border-r bg-white">
          <SideNavbar />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <HomePage />
      </div>
    </div>
  );
};

export default Home;
