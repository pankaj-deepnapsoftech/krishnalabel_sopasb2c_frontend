import { useState } from "react";
// import Intro from "../components/Authentication/Intro";
import { Link, useNavigate } from "react-router-dom";
import LoginComponent from "../components/Authentication/LoginComponent";
import ForgetPasswordComponent from "../components/Authentication/ForgetPasswordComponent";
import ForgetPasswordOTPVerificationComponent from "../components/Authentication/OTPVerificationComponent";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const [showLoginComponent, setShowLoginComponent] = useState<boolean>(true);
  const [showForgetPasswordComponent, setShowForgetPasswordComponent] =
    useState<boolean>(false);
  const [showOTPVerificationComponent, setShowOTPVerificationComponent] =
    useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100vh] flex">
      {/* <Intro /> */}

      {/* LOGIN AREA */}
      <div className="h-[100vh] w-full flex flex-col items-center justify-center">
        {/* Login Section */}
        {showLoginComponent && (
          <LoginComponent
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            setShowLoginComponent={setShowLoginComponent}
            setShowForgetPasswordComponent={setShowForgetPasswordComponent}
            setShowOTPVerificationComponent={setShowOTPVerificationComponent}
          />
        )}
        {/* Forget Password Section */}
        {showForgetPasswordComponent && (
          <ForgetPasswordComponent email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
        )}
      </div>
    </div>
  );
};

export default Login;
