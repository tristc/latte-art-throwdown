import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Trophy, User, Calendar, Plus, LogOut, Wifi, WifiOff } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#8B4513] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8" />
              <span className="font-bold text-xl">WEC Throwdown</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/events" className="hover:text-amber-200 transition">
                Events
              </Link>
              
              {user ? (
                <>
                  {user.role === 'organizer' && (
                    <Link to="/create-event" className="hover:text-amber-200 transition">
                      <span className="flex items-center space-x-1">
                        <Plus className="h-4 w-4" />
                        <span>Create Event</span>
                      </span>
                    </Link>
                  )}
                  
                  <Link to="/my-events" className="hover:text-amber-200 transition">
                    My Events
                  </Link>
                  
                  <Link to="/profile" className="hover:text-amber-200 transition">
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{user.displayName || user.firstName}</span>
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-amber-200 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-amber-200 transition">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
              {/* Connection Status */}
              <div className="ml-4" title={connected ? 'Connected' : 'Disconnected'}>
                {connected ? (
                  <Wifi className="h-5 w-5 text-green-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-400" />
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span className="font-semibold">WEC Latte Art Throwdown</span>
            </div>
            <p className="text-sm">© 2026 World Espresso Championships. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
