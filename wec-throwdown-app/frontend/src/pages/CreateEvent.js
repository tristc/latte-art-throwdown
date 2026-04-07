import React from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const CreateEvent = () => (
  <div className="max-w-2xl mx-auto text-center py-16">
    <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Event</h1>
    <p className="text-gray-600">This feature is coming soon. Check back later!</p>
    <Link to="/events" className="text-[#8B4513] hover:underline mt-4 inline-block">
      ← Back to Events
    </Link>
  </div>
);

export default CreateEvent;
