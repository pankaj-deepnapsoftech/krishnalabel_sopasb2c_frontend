import { useState } from "react";
import Intro from "../components/Authentication/Intro";
import RegisterComponent from "../components/Authentication/RegisterComponent";
import OTPVerificationComponent from "../components/Authentication/OTPVerificationComponent";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string | undefined>();

  const [showRegisterComponent, setShowRegisterComponent] =
    useState<boolean>(true);
  const [showOTPVerificationComponent, setShowOTPVerificationComponent] =
    useState<boolean>(false);

  return (
    <div className="w-full min-h-[100vh] flex">
      {/* <Intro /> */}

      {/* REGISTER AREA */}
      <div className="h-[100vh] w-full flex flex-col items-center justify-center">
        {/* Register Component */}
        {showRegisterComponent && <RegisterComponent email={email} setEmail={setEmail} setShowRegisterComponent={setShowRegisterComponent} setShowOTPVerificationComponent={setShowOTPVerificationComponent} />}
        {/* OTP Verification Component */}
        {showOTPVerificationComponent && <OTPVerificationComponent email={email} />}
      </div>
    </div>
  );
};

export default Register;
