import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-amber-50 to-transparent rounded-2xl">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-[#8B4513] p-4 rounded-full">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            WEC Latte Art
            <br />
            <span className="text-[#8B4513]">Throwdown Platform</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            The complete event management system for latte art throwdowns, smackdowns, and battles. 
            Create events, manage brackets, and track scores in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="bg-[#8B4513] hover:bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition"
            >
              <span>Browse Events</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            {!user && (
              <Link
                to="/register"
                className="border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white px-8 py-4 rounded-lg font-semibold transition"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-[#8B4513]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Management</h3>
            <p className="text-gray-600">
              Create and manage throwdowns with automated bracket generation, registration handling, and real-time updates.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-[#8B4513]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Competitor Experience</h3>
            <p className="text-gray-600">
              Easy registration, QR code check-in, live bracket viewing, and performance history tracking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-[#8B4513]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Scoring</h3>
            <p className="text-gray-600">
              Real-time bracket updates, digital scorecards, and public scoreboards for spectators.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#8B4513] text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Host Your Throwdown?</h2>
        <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
          Join the WEC platform and bring the excitement of latte art battles to your community.
        </p>
        
        <Link
          to={user ? '/create-event' : '/register'}
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition"
        >
          {user ? 'Create Event' : 'Get Started'}
        </Link>
      </section>
    </div>
  );
};

export default Home;
