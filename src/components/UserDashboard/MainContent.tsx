import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import logo from "../../assets/images/logo/logo.png";

const MainContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = {
    image:
      "https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg",
    name: "User",
    email: "user@email.com",
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex overflow-x-hidden ">
      {/* Main Content Area */}
      <Sidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            setIsSidebarOpen = {setIsSidebarOpen}
          />
      <div
        className={`${
          isSidebarOpen ? "ml-80" : "ml-0"
        } flex-1 transition-all duration-300`}
      >
        <div className="cursor-pointer w-full p-3 shadow-md px-10 flex items-center justify-between gap-1">
          <button className="lg:hidden " onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-blue-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="logo" className="h-12" />
            
          </div>
        </div>

        <div className="mt-6 p-5">
         
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
