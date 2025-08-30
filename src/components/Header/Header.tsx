import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/images/logo/logo.png";
import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ClickMenu from "../../ui/ClickMenu";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UserDetailsMenu from "../../ui/UserDetailsMenu";
import { IoReorderThreeOutline, IoNotificationsOutline } from "react-icons/io5";
import axios from "axios";
import { AiOutlineBell } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoArrowForward } from "react-icons/io5";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

import { setShowIcons } from "../../redux/reducers/sidebarSlice";

const Header: React.FC<{ setShowSideBar: () => void }> = ({
  setShowSideBar,
}) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cookie, _, removeCookie] = useCookies();
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>();
  const toast = useToast();
  const { firstname, lastname, email } = useSelector(
    (state: any) => state.auth
  );
  const {showIcons, changewidth} = useSelector((state: any) => state.sidebar);
  const dispatch = useDispatch();

  const token = cookie?.access_token;
  
  const fetchNotification = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}notification/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Failed to enter fullscreen", err));
    } else {
      // Exit fullscreen
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Failed to exit fullscreen", err));
    }
  };

  const unreadCount = notifications?.filter((notif: any) => notif?.view === false).length || 0;

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}notification/updateAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

   
      fetchNotification();

    } catch (error: any) {
      toast({
        title: "Failed",
        description: `${error?.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      removeCookie("role");
      removeCookie("name");
      removeCookie("email");
      toast({
        title: "Success",
        description: `Logged out successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Failed",
        description: `${error.message || "Something went wrong"}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="relative flex items-center justify-between border px-3 py-2 w-full">
    {/* Sidebar/Logo Section */}
    <div
      className={`flex items-center gap-2 justify-center transition-all duration-300
        ${changewidth || showIcons ? "w-1/5" : "w-[65px]"}
      `}
    >
      {/* Hamburger Toggle for Sidebar */}
      <span
        onClick={setShowSideBar}
        className="flex absolute  md:hidden rounded-full px-1 hover:bg-gray-200 cursor-pointer"
      >
        <IoReorderThreeOutline className="w-8 h-10" />
      </span>
  
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className={`absolute h-28  max-[800px]:hidden transition-all
          ${changewidth || showIcons
          ? "w-48 md:h-48 -top-[60px] left-0 max-[800px]:-top-20"
          : "w-24 md:h-36 -top-12 left-12 md:left-auto "}
        `}
      />
    </div>
  
    {/* Right Section (Icons, Avatar, etc.) */}
    <div
      className={`flex items-center gap-4 transition-all duration-300
        ${changewidth || showIcons ? "w-4/5" : "w-full"}
      `}
    >
      {/* Toggle Sidebar (Desktop only) */}
      <div
        className="hidden md:block pl-4"
        onClick={() => dispatch(setShowIcons({ showIcons: !showIcons }))}
      >
        {showIcons ? (
          <RxHamburgerMenu className={`text-2xl cursor-pointer ${changewidth ? "hidden" : "block"}`} />
        ) : (
          <IoArrowForward className={`text-2xl cursor-pointer ${changewidth ? "hidden" : "block"}`} />
        )}
      </div>
  
      {/* Fullscreen Toggle */}
      <button onClick={toggleFullscreen} className="ml-auto cursor-pointer">
        {isFullscreen ? (
          <MdFullscreenExit className="text-2xl" />
        ) : (
          <MdFullscreen className="text-2xl" />
        )}
      </button>
  
      {/* Notification Bell */}
      <div className="relative cursor-pointer" onClick={() => setIsNotificationOpen(true)}>
        <IoNotificationsOutline className="text-2xl" />
        {unreadCount > 0 && (
          <Badge
            colorScheme="red"
            className="absolute -top-1 -right-1 text-xs rounded-full px-2"
          >
            {unreadCount}
          </Badge>
        )}
      </div>
  
      {/* Avatar & Dropdown */}
      <Avatar
        cursor="pointer"
        size="md"
        name={firstname && lastname ? `${firstname} ${lastname}` : firstname}
        onClick={() => setShowUserDetails((prev) => !prev)}
      />
  
      {showUserDetails && (
        <ClickMenu
          top={70}
          right={30}
          closeContextMenuHandler={() => setShowUserDetails(false)}
        >
          <UserDetailsMenu
            email={email}
            firstname={firstname}
            lastname={lastname}
            logoutHandler={logoutHandler}
            closeUserDetailsMenu={() => setShowUserDetails(false)}
          />
        </ClickMenu>
      )}
    </div>
  
    {/* Notification Modal */}
    <Modal
      isOpen={isNotificationOpen}
      onClose={() => {
        setIsNotificationOpen(false);
        markAllAsRead();
      }}
      size="lg"
      closeOnOverlayClick={false}
      motionPreset="scale"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.15)"
        bg="white"
      >
        <ModalHeader className="flex items-center text-2xl font-bold">
          <AiOutlineBell size={24} className="mr-2" />
          Notifications
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {unreadCount === 0 ? (
            <div className="flex justify-center items-center py-6">
              <p className="text-gray-500 text-lg">No new notifications.</p>
            </div>
          ) : (
            notifications.map((notif: any) => (
              <div key={notif?._id} className="border-b py-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  {new Date(notif?.createdAt).toLocaleString()}
                </div>
                <p
                  className={`text-md ${
                    notif?.view ? "text-gray-400 line-through" : "text-gray-700"
                  }`}
                >
                  {notif?.message}
                </p>
              </div>
            ))
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  </div>
  
  );
};

export default Header;
