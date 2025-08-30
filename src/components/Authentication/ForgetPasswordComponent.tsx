import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation, useResetPasswordMutation } from "../../redux/api/api";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TbPasswordMobilePhone } from "react-icons/tb";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/logo.png";
interface ForgetPasswordComponentProps {
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
  password: string | undefined;
  setPassword: (email: string | undefined) => void;
}

const ForgetPasswordComponent: React.FC<ForgetPasswordComponentProps> = ({
  email,
  setEmail,
}) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [otp, setOtp] = useState<string | undefined>();
  const [gotOtp, setGotOtp] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [isForgetPasswordLoading, setIsForgetPasswordLoading] = useState<boolean>(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState<boolean>(false);

  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const forgetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsForgetPasswordLoading(true);
      const data = await forgetPassword({
        email: email
      }).unwrap();
      setGotOtp(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally{
      setIsForgetPasswordLoading(false);
    }
  };

  const resetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsResetPasswordLoading(true);
      const data = await resetPassword({
        email: email,
        otp: otp,
        password: newPassword,
      }).unwrap();
      toast.success(data.message);
      navigate(0);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally{
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
              <video
                className="w-full h-full object-cover filter brightness-75"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/manufacturing-productio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

      {/* Forgot Password Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-4 sm:px-6 md:px-10 py-10 w-[90%] sm:w-full md:w-[40%] border border-white/50">


        {/* Logo */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 mb-4">
          <img src={logo} alt="Company Logo" className="h-36 sm:h-40 md:h-48 w-auto" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:pt-16 pt-8 font-bold text-center text-sky-800 mb-6 font-serif">
          Company Forgot Password
        </h2>

        {/* Email Form */}
        {!gotOtp && (
          <form onSubmit={forgetPasswordHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-[600] text-gray-700 mb-1">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isForgetPasswordLoading}
              className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
            >
              {isForgetPasswordLoading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        )}

        {/* OTP + New Password Form */}
        {gotOtp && (
          <form onSubmit={resetPasswordHandler} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                type="text"
                placeholder="OTP"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  required
                />
                {!showNewPassword ? (
                  <IoEyeOffOutline
                    onClick={() => setShowNewPassword(true)}
                    size={20}
                    className="absolute top-[12px] right-3 cursor-pointer"
                  />
                ) : (
                  <IoEyeOutline
                    onClick={() => setShowNewPassword(false)}
                    size={20}
                    className="absolute top-[12px] right-3 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetPasswordLoading}
              style={{ boxShadow: "0 2px 0 rgba(5, 95, 255, 0.1)" }}
              className="w-full rounded-md bg-sky-600 text-white py-2 font-bold disabled:cursor-not-allowed disabled:bg-[#b7b6b6]"
            >
              {isResetPasswordLoading ? "Updating password..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </section>
  
  );
};

export default ForgetPasswordComponent;
