import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useSelector((state) => state.cart);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Sell to Us', href: '/sell' },
    { name: 'Services', href: '/services' },
    { name: 'Repairs', href: '/repairs' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-size-200 animate-gradient">Dev Electricals</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-secondary hover:text-primary px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/cart" className="text-secondary hover:text-primary relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </Link>
            {!token ? (
              <Link
                to="/signin"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out flex items-center gap-2"
              >
                <UserIcon className="h-5 w-5" />
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleSignOut}
                className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out flex items-center gap-2"
              >
                <UserIcon className="h-5 w-5" />
                Sign Out
              </button>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="md:hidden bg-white/80 backdrop-blur-lg"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {!token ? (
                    <Link
                      to="/signin"
                      className="bg-primary hover:bg-primary-dark text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="bg-secondary hover:bg-secondary-dark text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
                    >
                      Sign Out
                    </button>
                  )}
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    to="/cart"
                    className="text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart ({itemCount})
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </motion.nav>
      );
};

export default Navbar;