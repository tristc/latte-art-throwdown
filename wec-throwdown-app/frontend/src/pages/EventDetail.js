import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to load event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error || 'Event not found'}</p>
        <Link to="/events" className="text-[#8B4513] hover:underline mt-4 inline-block">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/events" className="inline-flex items-center text-[#8B4513] hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Events
      </Link>

      {event.cover_image_url ? (
        <img
          src={event.cover_image_url}
          alt={event.name}
          className="w-full h-64 object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
          <Calendar className="h-24 w-24 text-[#8B4513] opacity-30" />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>
            
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">
              {event.description || 'No description available.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{event.start_time} - {event.end_time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{event.location_name}</p>
                  <p className="text-sm text-gray-500">{event.location_city}, {event.location_country}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Competitors</p>
                  <p className="font-medium">{event.registeredCount} / {event.max_competitors} registered</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-80 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Organizer</h3>
              <p className="text-gray-600">
                {event.organizer_display_name || `${event.organizer_first_name} ${event.organizer_last_name}`}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Format</h3>
              <p className="text-gray-600 capitalize">{event.format?.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500 mt-1">Bracket Size: {event.bracket_size}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Time Limit</h3>
              <p className="text-gray-600">{event.time_limit_minutes} minutes per competitor</p>
            </div>

            <Link
              to={`/bracket/${event.id}`}
              className="block w-full bg-[#8B4513] hover:bg-amber-800 text-white text-center py-3 rounded-lg font-semibold transition"
            >
              View Bracket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
