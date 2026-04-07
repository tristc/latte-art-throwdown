import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const Bracket = () => {
  const { eventId } = useParams();
  
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bracket</h1>
      <p className="text-gray-600">Event ID: {eventId}</p>
      <p className="text-gray-500 mt-2">Full bracket visualization coming soon.</p>
      <Link to={`/events/${eventId}`} className="text-[#8B4513] hover:underline mt-4 inline-block">
        ← Back to Event
      </Link>
    </div>
  );
};

export default Bracket;
