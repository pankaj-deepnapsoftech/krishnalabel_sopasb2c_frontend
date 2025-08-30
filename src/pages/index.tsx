import { FC, ReactElement } from "react";
import Header from "../components/Authentication/Header";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Authentication/Footer";


const Main:FC = ():ReactElement => {
 

 
  return (
    <>
    {/* header */}
   <Header/>
   {/* outlet */}
   <Outlet/>
   
   {/* footer */}
   <Footer/>
    </>
  );
};

export default Main;
