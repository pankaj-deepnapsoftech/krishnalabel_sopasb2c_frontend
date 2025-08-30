import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Header: FC = (): ReactElement => {
  const mainMenuRef = useRef<HTMLElement>(null);
  const [isSlidDown, setIsSlidDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSlidDown(true);
      } else {
        setIsSlidDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={mainMenuRef}
      className={`main-head ${isSlidDown ? 'slidedown' : ''}`}
    >
      <div className="container">
        <div className="main-menu">
          <div className="logo">
            <span className='flex items-center gap-2' ><img src="/images/logo.png" alt="logo" className='h-10 w-10' /> <span>ITSYBIZZ</span></span>
          </div>
          <div className="nav-menu">
            <ul className="nav-list">
              <li className="nav-list-item ">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-list-item">
                <Link to="/login" className="nav-link">Employee Login </Link>
              </li>
              <li className={` my-[14px] mx-[11px] px-4 py-1 rounded-lg ${isSlidDown ? "bg-table-color text-white hover:bg-teal-500" : 'text-white hover:bg-white hover:text-black'}`}>
                <Link to="/login" className="nav-link">Admin Login</Link>
              </li>
             
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;