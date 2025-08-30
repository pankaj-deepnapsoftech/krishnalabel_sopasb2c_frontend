//@ts-nocheck
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NotAccess = () => {
    const [cookie, _, removeCookie] = useCookies();
    const navigate = useNavigate();
    const logoutHandler = () => {
      try {
        removeCookie("access_token");
        removeCookie("role");
        removeCookie("name");
        removeCookie("email");
        toast.success("Logged out successfully");
        navigate("/login");
      } catch (error: Error) {
        toast.error(error.message || "Something went wrong");
      }
    };
    
  return (
    <div className='w-full flex items-center justify-center flex-col h-screen'>
        <h1 className='font-bold text-3xl'>Access Denied!</h1>
        <p className='mt-2 mb-2 text-red-500 font-semibold'>Please wait for admin to verify you and assign the role :) </p>
       <Button
        colorScheme='orange'
        onClick={logoutHandler}
       >Logout</Button>
    </div>
  )
}

export default NotAccess