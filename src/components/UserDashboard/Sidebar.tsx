import { Link, useNavigate } from "react-router-dom";
import { SiSimpleanalytics } from "react-icons/si";
import { RiHistoryFill } from "react-icons/ri";
import { FaGears } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { IoCreate } from "react-icons/io5";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { userExists } from "../../redux/reducers/authSlice";
import { useEffect } from "react";
import logo from "../../assets/images/logo/logo.png";

type SidebarProps = {
  user: {
    image: string;
    name: string;
    email: string;
  };
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen : any;
};

const Sidebar: React.FC<SidebarProps> = ({
  user,
  isSidebarOpen,
  toggleSidebar,
  setIsSidebarOpen
}) => {
   const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();

  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      removeCookie("role");
      removeCookie("name");
      removeCookie("email");
      toast.success("Logged out successfully");
      navigate("/customer-login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };


  useEffect(() => {
    if (!cookie?.access_token) {
      navigate("/customer-login");
    } 
  }, []);

  return (
    <div
    className={`${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 transition-transform duration-300 fixed top-0 left-0 h-full w-80 bg-gray-300 p-6 space-y-8 shadow-lg lg:mt-0 mt-10`}
  >
    <div className="flex flex-col justify-center items-center gap-3 p-7 w-full">
      <div className="cursor-pointer w-40 h-40 bg-white rounded-full shadow-md flex items-center justify-center gap-2">
        <img src={logo} alt="logo" className=" bg-transparent" />
        
      </div>
  
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-black">{cookie.name}</h1>
        <p className="text-lg text-gray-800">{cookie.email}</p>
      </div>
    </div>
  
    <nav className="space-y-6">
      {/* Show Overview, Purchase History, and Settings for "user" role */}
      {cookie?.role === "user" && (
        <>
          <Link
            to="/userboard"
            className="block p-5 rounded-md text-xl border-b border-gray-400 transition-colors duration-300 hover:text-blue-700"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <div className="flex items-center justify-start gap-3">
              <SiSimpleanalytics className="text-blue-800" />
              <h1> Overview</h1>
            </div>
          </Link>
  
          <Link
            to="/purchase-history"
            className="block p-5 rounded-md text-xl border-b border-gray-400 transition-colors duration-300 hover:text-blue-800"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <div className="flex items-center justify-start gap-3">
              <RiHistoryFill className="text-2xl text-blue-800" />
              <h1> Purchase History</h1>
            </div>
          </Link>
  
          <Link
            to="/settings"
            className="block p-5 rounded-md text-xl border-b border-gray-400 transition-colors duration-300 hover:text-blue-800"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <div className="flex items-center justify-start gap-3">
              <FaGears className="text-3xl text-blue-800" />
              <h1>Settings</h1>
            </div>
          </Link>
        </>
      )}
  
      {cookie?.role === "Security Guard" && (
        <>
          <Link
            to="/entries"
            className="block p-5 rounded-md text-xl border-b border-gray-400 transition-colors duration-300 hover:text-blue-800"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <div className="flex items-center justify-start gap-3">
              <TbTruckDelivery className="text-3xl text-blue-800" />
              <h1> All Entries</h1>
            </div>
          </Link>
  
          <Link
            to="/new-entry"
            className="block p-5 rounded-md text-xl border-b border-gray-400 transition-colors duration-300 hover:text-blue-800"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <div className="flex items-center justify-start gap-3">
              <IoCreate className="text-3xl text-blue-800" />
              <h1>New Entry</h1>
            </div>
          </Link>
        </>
      )}
    </nav>
  
    <div className="mt-auto">
      <button
        onClick={logoutHandler}
        className="w-full py-3 mt-6 bg-blue-800 text-white text-xl font-semibold rounded-md transition-colors duration-300 hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  </div>
  
  );
};

export default Sidebar;
