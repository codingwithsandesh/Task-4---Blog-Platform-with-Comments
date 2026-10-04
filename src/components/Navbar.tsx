import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, User as UserIcon, LogOut, LayoutDashboard, BookOpen, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E3DC] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-baseline gap-2">
          <Link
            to="/"
            className="font-serif text-2xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap"
          >
            BlogSphere
          </Link>
          <span className="hidden sm:inline text-[10px] uppercase font-semibold tracking-widest text-[#1E3A8A] font-sans">
            · India
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link
            to="/"
            className={`transition-colors hover:text-stone-900 ${
              isActive('/') && location.pathname === '/' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className={`transition-colors hover:text-stone-900 ${
              isActive('/blogs') ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            Explore
          </Link>
          <Link
            to="/about"
            className={`transition-colors hover:text-stone-900 ${
              isActive('/about') ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`transition-colors hover:text-stone-900 ${
              isActive('/contact') ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to={user ? '/blogs/new' : '/login?redirect=/blogs/new'}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg transition-colors whitespace-nowrap"
          >
            <PenSquare className="w-4 h-4 text-stone-600" />
            <span>Write Story</span>
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-medium text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-stone-800 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-xs text-stone-700 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                    <p className="text-stone-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 text-stone-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/my-blogs"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 text-stone-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <BookOpen className="w-4 h-4 text-stone-500" />
                    <span>My Articles</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 text-stone-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    <span>Profile Settings</span>
                  </Link>
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-medium text-stone-700 hover:text-stone-950 px-3 py-2 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to={user ? '/blogs/new' : '/login'}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg"
            aria-label="Write a story"
          >
            <PenSquare className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF8F5] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3 text-sm font-medium text-stone-700">
            <Link to="/" className="py-1 hover:text-stone-950">Home</Link>
            <Link to="/blogs" className="py-1 hover:text-stone-950">Explore Articles</Link>
            <Link to="/about" className="py-1 hover:text-stone-950">About BlogSphere</Link>
            <Link to="/contact" className="py-1 hover:text-stone-950">Contact Us</Link>
          </nav>
          
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-medium text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{user.name}</p>
                    <p className="text-[11px] text-stone-500">{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="text-xs py-1.5 font-medium text-stone-800 hover:text-stone-950">
                  Dashboard
                </Link>
                <Link to="/my-blogs" className="text-xs py-1.5 font-medium text-stone-800 hover:text-stone-950">
                  My Articles
                </Link>
                <Link to="/profile" className="text-xs py-1.5 font-medium text-stone-800 hover:text-stone-950">
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-left py-1.5 font-medium text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-center py-2.5 text-xs font-semibold text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
