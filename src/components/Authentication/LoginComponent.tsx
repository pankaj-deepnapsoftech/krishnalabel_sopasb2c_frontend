import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userExists } from "../../redux/reducers/authSlice";
import { useState } from "react";
import { useCookies } from "react-cookie";
import logo from "../../assets/images/logo/logo.png";
interface LoginComponentProps {
  email: string | undefined;
  password: string | undefined;
  setEmail: (email: string | undefined) => void;
  setPassword: (password: string | undefined) => void;
  setShowLoginComponent: (show: boolean) => void;
  setShowForgetPasswordComponent: (show: boolean) => void;
  setShowOTPVerificationComponent: (show: boolean) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  setShowLoginComponent,
  setShowForgetPasswordComponent,
  setShowOTPVerificationComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const [login] = useLoginMutation();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoginLoading(true);
      const data = await login({
        email: email,
        password: password,
      }).unwrap();

    

      if (data.user.role) {
        dispatch(userExists(data.user));
      } else if (data?.user?.isSuper) {
        dispatch(userExists({ ...data.user, role: "admin" }));
      } else {
        dispatch(userExists({ ...data.user, role: "emp" }));
      }
      setCookie("access_token", data.token, { maxAge: 86400 });
      if (data?.user?.isSuper) {
        setCookie("role", "admin", { maxAge: 86400 });
      } else {
        setCookie("role", data?.user?.role?.role || "emp", { maxAge: 86400 });
      }
      setCookie("name", data.user.first_name, { maxAge: 86400 });
      setCookie("email", data.user.email, { maxAge: 86400 });
      toast.success(data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || "Something went wrong");
    
    } finally {
      setIsLoginLoading(false);
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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl px-6 py-10 w-[90%] sm:w-96 md:w-[35%] border border-white/50">
        {/* Logo */}
        <div className="absolute z-50 -top-14 max-[800px]:-top-5   left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Company Logo" className="h-36 sm:h-40 md:h-56 w-auto" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center md:pt-20 pt-12 text-sky-800 mb-6 sm:mb-8 font-serif">
          Company Sign In
        </h2>

        {/* Form */}
        <form onSubmit={loginHandler} className="space-y-5 sm:space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                value={password}
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember Me and Forgot */}
          <div className="flex  sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 gap-2">
            <Link to="/register" className="text-blue-600 hover:underline">
              Registration
            </Link>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => {
                setShowForgetPasswordComponent(true);
                setShowLoginComponent(false);
                setShowOTPVerificationComponent(false);
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoginLoading}
            type="submit"
            className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition duration-200"
          >
            {isLoginLoading ? "Sign In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition duration-150 bg-white"
          >
            <Link to="/customer-login" className="text-sm text-blue-600 hover:underline">
              Sign in as a customer
            </Link>
          </button>
        </form>
      </div>

    </section>
  );
};

export default LoginComponent;
