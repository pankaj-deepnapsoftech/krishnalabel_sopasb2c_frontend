import logo from "../../assets/images/logo/logo.png";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Intro: React.FC = () => {
  return (
    <div className="hidden xl:flex bg-[#e3e3e3] h-[100vh] w-[50%] flex-col justify-center items-center">
      <div className="mb-5">
        <Link to="/">
          <img className="w-[200px] bg-transparent" src={logo} ></img>
        </Link>
      </div>
      <div>
        <h1 className="mb-2 text-2xl font-bold text-center text-[#4f5d75]">
          WELCOME TO KRISHNA LABELS INC
        </h1>
        <p className="text-center mb-5 text-[#4f5d75] font-semibold">
          Precision in Every Thread, Trust in Every Tag
        </p>

        <div className="text-sm text-[#4f5d75] font-bold">
          <div className=" leading-7">
            <p className="flex items-center gap-x-2">
              <FaCheckCircle className="text-green-500 text-lg"  />
              Empowering Quality Since 1970 - A Legacy of Dalmack Auto Electric
              PL
            </p>
          </div>
          <div className="leading-7">
            <p className="flex items-center gap-x-2">
              <FaCheckCircle className="text-green-500 text-lg" />
              "Your vision, our labels. Crafting excellence for a global
              clientele."
            </p>
          </div>
          <div className=" leading-7">
            <p className="flex items-center gap-x-2">
              <FaCheckCircle className="text-green-500 text-lg" />
              Secure Access Protecting your data with industry-standard
              security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
