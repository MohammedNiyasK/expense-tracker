import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { User } from '@/redux/authSlice';
import { logout } from '@/utils/api';
import { useAppDispatch } from '@/hooks/hooks';
import { LOGOUT } from '@/redux/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const data = await logout();
      console.log(data);
      if (data.success) {
        localStorage.removeItem('profile');
        dispatch(LOGOUT());
        navigate('/signin', { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Expense Tracker
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <small className="hidden lg:block text-sm font-medium leading-none py-2 px-3">
            {(user as User).username}
          </small>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                    : 'block py-2 px-3 text-gray-900  rounded md:bg-transparent md:text-gray-900 md:p-0 md:dark:text-blue-500'
                }
                aria-current="page"
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                    : 'block py-2 px-3 text-gray-900  rounded md:bg-transparent md:text-gray-900 md:p-0 md:dark:text-blue-500'
                }
              >
                Transactions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                    : 'block py-2 px-3 text-gray-900  rounded md:bg-transparent md:text-gray-900 md:p-0 md:dark:text-blue-500'
                }
              >
                Reports
              </NavLink>
            </li>
            <li className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hidden">
              {(user as User).username}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
