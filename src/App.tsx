import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import routes from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./pages/NotFound";
import Main from "./pages";
import Home from "./components/Authentication/Home";
import Contact from "./components/Authentication/Contact";
import About from "./components/Authentication/About";
import MainContent from "./components/UserDashboard/MainContent";
import Overview from "./components/UserDashboard/Overview";
import PurchaseHistory from "./components/UserDashboard/PurchaseHistory";
import Settings from "./components/UserDashboard/Settings";
import Entries from "./components/UserDashboard/Entries";
import NewEntry from "./components/UserDashboard/NewEntry";
import { useCookies } from "react-cookie";
import CustomerLogin from "./components/Authentication/CustomerLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotAccess from "./components/NotAccess";

const App: React.FC = () => {

  const { allowedroutes, isSuper, role } = useSelector((state: any) => state.auth);
  const [userRole, setUserRole] = useState<string | null>(null)
  const [cookies] = useCookies();




  useEffect(() => {
    setUserRole(role || cookies?.role);
  }, [cookies, role])

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {userRole === "user" || userRole === "Security Guard" ? <Route element={<MainContent />} >
            {userRole === "user" ? <> <Route path="/userboard" element={<Overview />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/settings" element={<Settings />} /></> : <Route path="*" element={<Navigate to="/entries" replace />} />}
            {userRole === "Security Guard" ? <><Route path="/entries" element={<Entries />} />
              <Route path="/new-entry" element={<NewEntry />} /></> : <Route path="*" element={<Navigate to="/userboard" replace />} />}
          </Route> : <Route path="*" element={<Navigate to="/" replace />} />}

          <Route element={<Main />} >
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access" element={<NotAccess />} />

          {userRole !== "user" && userRole !== "Security Guard" ? <Route path="/" element={<Layout />}>
            {routes.map((route, ind) => {
              const isAllowed = isSuper || allowedroutes.includes(route.path.replaceAll('/', ''));
              if (route.isSublink) {
                return (
                  <Route key={ind} path={route.path} element={route.element}>
                    {route.sublink &&
                      route.sublink.map((sublink, index) => {
                        return (
                          <Route
                            key={index}
                            path={sublink.path}
                            element={sublink.element}
                          ></Route>
                        );
                      })}
                  </Route>
                );
              } else {
                return (
                  <Route
                    index={route.name === "Dashboard" ? true : false}
                    key={ind}
                    path={route.path}
                    element={route.element}
                  ></Route>
                );
              }
            })}
          </Route> : <Route path="/" element={<Navigate to="/userboard" replace />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
