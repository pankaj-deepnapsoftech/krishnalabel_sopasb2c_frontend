

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { setWidth } from "../../redux/reducers/sidebarSlice";
import useIsMobile from "../UseMobile";

const Navigation: React.FC<{ setShowSideBar: () => void }> = ({ setShowSideBar }) => {
  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);
  const { showIcons, changewidth } = useSelector((state: any) => state.sidebar);
  const dispatch = useDispatch();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const isMobile = useIsMobile();
  const toggleSubMenusHandler = (path: string) => {
    setOpenSubMenus((prev: { [key: string]: boolean }) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };
  // useEffect(() => {
  //   if (isMobile) {
  //     setShowIcons(true);
  //   }
  // }, [isMobile]);
  return (
    <>
      {showIcons || isMobile ? (
        <div className="h-[inherit] px-3 py-3   bg-[#fbfbfb]">
          <ul>
            {routes.map((route, ind) => {
              const isAllowed =
                isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));

              if (route.name === "Task" && isSuper) {
                return null;
              }

              if (route.isSublink) {
                return (
                  <Fragment key={ind} >
                    <div>
                      <li
                        className="flex border-b  gap-x-2 pl-3 pr-9 py-5 rounded-lg hover:bg-[#e6efff] hover:text-[#319795] hover:cursor-pointer text-[15px] font-semibold"
                        onClick={() => toggleSubMenusHandler(route.path)}
                        style={{
                          cursor: isAllowed ? "pointer" : "not-allowed",
                          opacity: isAllowed ? 1 : 0.5,
                          pointerEvents: isAllowed ? "auto" : "none",
                        }}
                      >
                        <span>{route.icon}</span>
                        <span>{route.name}</span>
                        <span className="pt-1" >
                          {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                        </span>
                      </li>
                      {openSubMenus[route.path] &&
                        route.sublink &&
                        route.sublink.map((sublink, index) => (
                          <NavLink
                            onClick={setShowSideBar}
                            key={index}
                            to={route.path + "/" + sublink.path}
                            className={({ isActive }) =>
                              `flex gap-x-2 pl-5 pr-9 py-3 rounded-lg text-[15px] font-semibold 
                            hover:bg-[#e6efff] hover:text-[#319795] hover:cursor-pointer 
                            ${isActive ? "bg-[#e6efff] text-[#319795]" : ""}`
                            }
                            style={{
                              cursor: isAllowed ? "pointer" : "not-allowed",
                              opacity: isAllowed ? 1 : 0.5,
                              pointerEvents: isAllowed ? "auto" : "none",
                            }}
                          >
                            <li className="flex gap-x-2">
                              <span>{sublink.icon}</span>
                              <span>{sublink.name}</span>
                            </li>
                          </NavLink>

                        ))}
                    </div>
                  </Fragment>
                );
              }
              else if (route.name === "Approval" ) {
                return (
                  <NavLink
                    key={ind}
                    onClick={setShowSideBar}
                    to={route.path || ""}
                    className={({ isActive }) =>
                      `flex border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg text-[15px] font-semibold 
                      hover:bg-[#e6efff] hover:text-[#319795] hover:cursor-pointer 
                      ${isActive ? "bg-[#e6efff] text-[#319795]" : ""}`
                    }
                    style={{
                      cursor: ind === 0 || isAllowed ? "pointer" : "not-allowed",
                      opacity: ind === 0 || isAllowed ? 1 : 0.5,
                      pointerEvents: ind === 0 || isAllowed ? "auto" : "none",
                    }}
                  >
                    <li className="flex gap-x-2">
                      <span className="text-xl">{route.icon}</span>
                      <span>{route.name}</span>
                    </li>
                  </NavLink>
                );
              }
              else if (route.name !== "Approval") {
                return (
                  <NavLink
                    key={ind}
                    onClick={setShowSideBar}
                    to={route.path || ""}
                    className={({ isActive }) =>
                      `flex border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg text-[15px] font-semibold 
                      hover:bg-[#e6efff] hover:text-[#319795] hover:cursor-pointer 
                      ${isActive ? "bg-[#e6efff] text-[#319795]" : ""}`
                    }
                    style={{
                      cursor: ind === 0 || isAllowed ? "pointer" : "not-allowed",
                      opacity: ind === 0 || isAllowed ? 1 : 0.5,
                      pointerEvents: ind === 0 || isAllowed ? "auto" : "none",
                    }}
                  >
                    <li className="flex gap-x-2">
                      <span className="text-xl">{route.icon}</span>
                      <span>{route.name}</span>
                    </li>
                  </NavLink>

                );
              }
            })}
          </ul>
        </div>
      ) : (
        <div className="h-[inherit] px-3 py-3 bg-[#fbfbfb]    ">
          <ul>
            {routes.map((route, ind) => {
              const isAllowed =
                isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));
              if (route.name === "Task" && isSuper) return null;
              // Sublink menu
              if (route.isSublink) {
                return (
                  <Fragment key={ind}>
                    <div>
                      <li
                        className="relative group flex items-center border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg hover:bg-[#e6efff] hover:text-[#319795] text-[15px] font-semibold"
                        onClick={() => toggleSubMenusHandler(route.path)}
                        onMouseEnter={() => dispatch(setWidth({ changewidth: true }))}
                        onMouseLeave={() => dispatch(setWidth({ changewidth: false }))}
                        style={{
                          cursor: isAllowed ? "pointer" : "not-allowed",
                          opacity: isAllowed ? 1 : 0.5,
                          pointerEvents: isAllowed ? "auto" : "none",
                        }}
                      >
                        <span className="text-xl">{route.icon}</span>
                        <span
                          className={`absolute left-12 ${changewidth ? "opacity-100" : "opacity-0"} whitespace-nowrap transition-opacity duration-300 pointer-events-none`}
                          style={{ top: "50%", transform: "translateY(-50%)" }}
                        >
                          {route.name}
                        </span>
                        <span
                          className={`absolute left-[calc(90%)] ${changewidth ? "opacity-100" : "opacity-0"} transition-opacity duration-300 pointer-events-none pt-1`}
                        >
                          {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                        </span>
                      </li>

                      {openSubMenus[route.path] &&
                        route.sublink?.map((sublink, index) => (
                          <NavLink
                            onMouseEnter={() => dispatch(setWidth({ changewidth: true }))}
                            onMouseLeave={() => dispatch(setWidth({ changewidth: false }))}
                            key={index}
                            to={route.path + "/" + sublink.path}
                            onClick={setShowSideBar}
                            className={({ isActive }) =>
                              `relative group flex items-center gap-x-2 pl-5 pr-9 py-3 rounded-lg text-[15px] font-semibold 
                              ${isActive ? "bg-[#e6efff] text-[#319795]" : "hover:bg-[#e6efff] hover:text-[#319795]"}`
                            }
                            style={{
                              cursor: isAllowed ? "pointer" : "not-allowed",
                              opacity: isAllowed ? 1 : 0.5,
                              pointerEvents: isAllowed ? "auto" : "none",
                            }}
                          >
                            <li>
                              <span className="text-xl">{sublink.icon}</span>
                              <span
                                className={`absolute left-12 ${changewidth ? "opacity-100" : "opacity-0"
                                  } whitespace-nowrap transition-opacity duration-300 pointer-events-none`}
                                style={{ top: "50%", transform: "translateY(-50%)" }}
                              >
                                {sublink.name}
                              </span>
                            </li>
                          </NavLink>

                        ))}
                    </div>
                  </Fragment>
                );
              }

              // Approval link (super user)
              if (route.name === "Approval" && isSuper) {
                return (
                  <NavLink
                  onMouseEnter={() => dispatch(setWidth({ changewidth: true }))}
                  onMouseLeave={() => dispatch(setWidth({ changewidth: false }))}
                    key={ind}
                    to={route.path || ""}
                    onClick={setShowSideBar}
                    className={({ isActive }) =>
                      `block relative group flex items-center border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg text-[15px] font-semibold
                      ${isActive ? "bg-[#e6efff] text-[#319795]" : "hover:bg-[#e6efff] hover:text-[#319795]"}`
                    }
                    style={{
                      cursor: ind === 0 || isAllowed ? "pointer" : "not-allowed",
                      opacity: ind === 0 || isAllowed ? 1 : 0.5,
                      pointerEvents: ind === 0 || isAllowed ? "auto" : "none",
                    }}
                  >
                    <li>
                      <span className="text-xl">{route.icon}</span>
                      <span
                        className={`absolute left-12 ${changewidth ? "opacity-100" : "opacity-0"
                          } whitespace-nowrap transition-opacity duration-300 pointer-events-none`}
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                      >
                        {route.name}
                      </span>
                    </li>
                  </NavLink>

                );
              }

              // All other links
              if (route.name !== "Approval") {
                return (
                  <NavLink
                  onMouseEnter={() => dispatch(setWidth({ changewidth: true }))}
                  onMouseLeave={() => dispatch(setWidth({ changewidth: false }))}
                    key={ind}
                    to={route.path || ""}
                    onClick={setShowSideBar}
                    className={({ isActive }) =>
                      `block relative group flex items-center border-b gap-x-2 pl-3 pr-9 py-5 rounded-lg text-[15px] font-semibold
                      ${isActive ? "bg-[#e6efff] text-[#319795]" : "hover:bg-[#e6efff] hover:text-[#319795]"}`
                    }
                    style={{
                      cursor: ind === 0 || isAllowed ? "pointer" : "not-allowed",
                      opacity: ind === 0 || isAllowed ? 1 : 0.5,
                      pointerEvents: ind === 0 || isAllowed ? "auto" : "none",
                    }}
                  >
                    <li>
                      <span className="text-xl">{route.icon}</span>
                      <span
                        className={`absolute left-12 ${changewidth ? "opacity-100" : "opacity-0"
                          } whitespace-nowrap transition-opacity duration-300 pointer-events-none`}
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                      >
                        {route.name}
                      </span>
                    </li>
                  </NavLink>

                );
              }

              return null;
            })}
          </ul>
        </div>
      )
      }

    </>


  );
};

export default Navigation;