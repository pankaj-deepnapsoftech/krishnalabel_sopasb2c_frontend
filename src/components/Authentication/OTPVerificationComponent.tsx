import { useEffect, useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  useResendOTPMutation,
  useVerifyUserMutation,
} from "../../redux/api/api";
import { toast } from "react-toastify";
import { TbPasswordMobilePhone } from "react-icons/tb";
import logo from "../../assets/images/logo/logo.png";
interface OTPVerificationComponentProps {
  email: string | undefined;
}

const OTPVerificationComponent: React.FC<OTPVerificationComponentProps> = ({
  email,
}) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string | undefined>();

  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
  const [isResendingOTP, setIsResendingOTP] = useState<boolean>(false);

  const [canResend, setCanResend] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const [verify] = useVerifyUserMutation();
  const [resendOTP] = useResendOTPMutation();

  const verifyHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsVerifyingOTP(true);
      const data = await verify({
        email: email,
        otp: otp,
      }).unwrap();
      toast.success(data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resendOTPHandler = async () => {
    try {
      const data = await resendOTP({ email }).unwrap();
      toast.success(data.message);
      setCanResend(false);
      setSecondsLeft(30);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsResendingOTP(false);
    }
  };

  useEffect(() => {
    setSecondsLeft(30);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            setCanResend(true);
            clearInterval(interval);
          }

          return prevSeconds - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [canResend]);

  return (
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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl px-4 sm:px-6 md:px-10 py-10 w-[90%] sm:w-[80%] md:w-[60%] lg:w-1/3 border border-white/50">

        {/* Logo */}
        <div className="absolute md:-top-5 top-0  left-1/2 transform -translate-x-1/2">
          <img onClick={() => navigate(0)} src={logo} alt="Company Logo" className="h-36 sm:h-40 w-auto cursor-pointer" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-sky-800 pt-20 mb-6">
          OTP VERIFICATION
        </h2>

        {/* Form */}
        <form onSubmit={verifyHandler} className="space-y-6">
          <div>
            <label className="block text-md font-bold text-gray-700 mb-1">OTP</label>
            <input
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter your Otp.."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={resendOTPHandler}
              disabled={!canResend}
              className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
            >
              {canResend ? "Resend OTP" : `Resend (${secondsLeft}s)`}
            </button>
            <button
              disabled={isVerifyingOTP}
              type="submit"
              className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700 transition duration-200"
            >
              {isVerifyingOTP ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </section>

  );
};

export default OTPVerificationComponent;
