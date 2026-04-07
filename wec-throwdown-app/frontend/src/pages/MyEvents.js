import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Construction } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MyEvents = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Events</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your registered events and competition history will appear here.
        </p>
        
        <Link
          to="/events"
          className="inline-flex items-center space-x-2 bg-[#8B4513] text-white px-6 py-3 rounded-lg font-semibold mt-6 hover:bg-amber-800 transition"
        >
          <Calendar className="h-5 w-5" />
          <span>Browse Events</span>
        </Link>
      </div>
    </div>
  );
};

export default MyEvents;
