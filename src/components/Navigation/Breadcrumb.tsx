import React from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../routes/routes";

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  // Split the pathname into segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Build breadcrumb paths
  const breadcrumbPaths = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const matchedRoute = routes.find((route: any) => route.path === path);
    const name = matchedRoute?.name || capitalizeFirstLetter(segment);
    return {
      name,
      path,
    };
  });

  return (
    <nav
      className="py-2 flex items-center space-x-2 text-sm text-gray-500"
      aria-label="Breadcrumb"
    >
      <div className="flex items-center">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        {breadcrumbPaths.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <span className="mx-2 text-gray-400">/</span>
            {index < breadcrumbPaths.length - 1 ? (
              <Link
                to={crumb.path}
                className="hover:text-blue-600 transition-colors"
              >
                {capitalizeFirstLetter(crumb.name)}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">
                {capitalizeFirstLetter(crumb.name)}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
