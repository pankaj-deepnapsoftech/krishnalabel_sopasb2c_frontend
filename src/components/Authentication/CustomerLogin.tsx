import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Intro from "./Intro";
import axios from "axios";
import CoustomerForget from "./Coustomer.forget";
import ResetCustomerPassword from "./ResetCustomerPassword";
import logo from "../../assets/images/logo/logo.png";
import { Link } from "react-router-dom";
const CustomerLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [step, setStep] = useState<number>(0);
  const [forgetEmail, setForgetEmail] = useState<string>("");
  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}customer/login`,
        { email, password }
      );
      const data = response.data;

      setCookie("access_token", data.token, { maxAge: 86400 });
      setCookie("role", "user", { maxAge: 86400 });
      setCookie("name", data.user.full_name, { maxAge: 86400 });
      setCookie("email", data.user.email, { maxAge: 86400 });
      toast.success(data.message);
 
      window.location.href = "/userboard";
    } catch (error) {
      console.error("Login failed:", error);
      toast("Login failed!");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      {step === 0 ? (
        <section className="relative h-screen w-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] overflow-hidden">

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

          {/* Login Card */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl px-4 sm:px-6 md:px-10 py-10 w-[90%] sm:w-full max-w-md border border-white/50">

            {/* Logo */}
            <div className="absolute z-50 -top-12 left-1/2 transform -translate-x-1/2">
              <img src={logo} alt="Company Logo" className="h-36 sm:h-40 md:h-52 w-auto" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center pt-10 md:pt-20 text-sky-800 mb-8 font-serif">Customer Sign In</h2>

            {/* Form */}
            <form onSubmit={loginHandler} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email Address"
                    className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
                  />
                  {!showPassword ? (
                    <IoEyeOffOutline
                      onClick={() => setShowPassword(true)}
                      size={20}
                      className="absolute top-[12px] right-3 cursor-pointer"
                    />
                  ) : (
                    <IoEyeOutline
                      onClick={() => setShowPassword(false)}
                      size={20}
                      className="absolute top-[12px] right-3 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                disabled={isLoginLoading}
                type="submit"
                className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition duration-200"
              >
                {isLoginLoading ? "Sign In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-sm text-gray-500">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Alternate Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition duration-150 bg-white"
            >
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Sign in as a company
              </Link>
            </button>
          </div>
        </section>
    
      ) : step === 1 ? (
        <CoustomerForget
          setStep={setStep}
          forgetEmail={forgetEmail}
          setForgetEmail={setForgetEmail}
        />
      ) : (
        <ResetCustomerPassword email={forgetEmail} setStep={setStep} />
      )}
    </>
  );
};

export default CustomerLogin;
