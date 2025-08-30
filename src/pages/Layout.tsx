import { useCookies } from "react-cookie";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { userExists } from "../redux/reducers/authSlice";
import Navigation from "../components/Navigation/Navigation";
import Container from "../components/Container/Container";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/Navigation/Breadcrumb";


const Layout: React.FC = () => {
  const [cookies, setCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSideBar,setShowSideBar] = useState<boolean>(false)
  const {showIcons, changewidth} = useSelector((state: any) => state.sidebar);
  const loginWithTokenHandler = async (token: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/login",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setCookie("access_token", data.token, { maxAge: 86400 });
      if(data?.user?.role){
        dispatch(userExists(data.user));
      }else{
        dispatch(userExists({...data.user,role:"admin"}));
      }
    } catch (err: any) {
      navigate('/login');
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!cookies?.access_token) {
      navigate("/customer-login");
    } else {
      loginWithTokenHandler(cookies?.access_token);
    }
  }, []);

  return (
    <div>
      <Header setShowSideBar={()=>setShowSideBar(!showSideBar)} />

      <div className="h-[90vh] overflow-hidden flex gap-x-5">
        <div
          className={`h-[inherit] border overflow-x-hidden absolute  ${showSideBar ? "left-0" :"-left-72" }   md:static z-10  bg-white transition-all duration-500   
          ${changewidth ? "w-[260px]" : showIcons ? "w-[260px]" : "w-[90px] max-[800px]:w-[60vw]"} 
          `}
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <Navigation setShowSideBar={()=>setShowSideBar(!showSideBar)} />
        </div>
        <div className="flex-1  w-[100%] px-3 overflow-auto">
          <Breadcrumb />
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
