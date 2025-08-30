import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundImage from '../assets/images/not-found.png';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This takes the user to the previous page
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center p-4">
      <div className="max-w-md">
        <img src={NotFoundImage} alt="404 Not Found" className="h-72 mx-auto mb-6" />
        <h1 className="text-4xl font-semibold text-red-600 mb-4">Oops! Page not found.</h1>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        {/* Button to go to the previous page */}
        <button
          onClick={handleGoBack}
          className="bg-teal-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-teal-600 transition duration-300"
        >
          Go Back
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;