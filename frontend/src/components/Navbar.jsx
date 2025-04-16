import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi'; // Import logout icon

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const userInitials = user ? user.name.split(" ")[0][0] + user.name.split(" ")[1]?.[0] : "";

  return (
    <nav className="bg-[#12192c] text-white fixed top-0 left-0 right-0 z-10 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-semibold tracking-wide text-white">
                Digital Store
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    My Products
                  </Link>
                  <Link to="/add-product" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Add Product
                  </Link>
                  <Link to="/cart" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Cart
                  </Link>
                  <Link to="/my-orders" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My Orders
                  </Link>

                  <div className="relative group"> {/* Hover effect on profile avatar */}
                    <div
                      onClick={() => navigate("/profile")}
                      className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700"
                    >
                      {userInitials}
                    </div>
                    {/* Name below the avatar */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white px-4 py-2 rounded-md text-sm z-10">
                      {user.name}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-md transition duration-300 hover:bg-red-700 flex items-center"
                  >
                    <FiLogOut className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-900 px-5 py-2 rounded-lg shadow-md transition duration-300 hover:bg-gray-200 mr-2"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-300 hover:bg-blue-700"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          {user && (
            <>
              <Link to="/" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                My Products
              </Link>
              <Link to="/add-product" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Add Product
              </Link>
              <Link to="/cart" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Cart
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-center flex items-center justify-center"
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-blue-900 block px-3 py-2 rounded-md text-base font-medium w-full text-center"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-center"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;