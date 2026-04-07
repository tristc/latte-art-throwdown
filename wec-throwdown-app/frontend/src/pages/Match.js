import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const Match = () => {
  const { id } = useParams();
  
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Match</h1>
      <p className="text-gray-600">Match ID: {id}</p>
      <p className="text-gray-500 mt-2">Match details and scoring coming soon.</p>
      <Link to="/events" className="text-[#8B4513] hover:underline mt-4 inline-block">
        ← Back to Events
      </Link>
    </div>
  );
};

export default Match;
