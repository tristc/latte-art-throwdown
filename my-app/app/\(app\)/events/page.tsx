'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Plus, Trophy } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: filter === 'past' });

      if (filter === 'upcoming') {
        query = query.gte('start_date', new Date().toISOString());
      } else if (filter === 'past') {
        query = query.lt('start_date', new Date().toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-300">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl font-bold">All Events</h1>
            <Link href="/events/create" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="card card-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.format === 'MATCH_PATTERN' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {event.format === 'MATCH_PATTERN' ? 'Match Pattern' : 'Freestyle'}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-1">{event.name}</h2>
                  
                  <div className="space-y-1 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(new Date(event.startDate))}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <p className="mt-3 text-sm text-zinc-500 line-clamp-2">
                  {event.description}
                </p>
              )}
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="card text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-lg font-medium mb-2">No Events Found</h2>
            <p className="text-zinc-500 mb-4">
              {filter === 'upcoming' 
                ? 'No upcoming events scheduled' 
                : filter === 'past'
                ? 'No past events'
                : 'No events created yet'}
            </p>
            <Link href="/events/create" className="btn-primary inline-block">
              Create Your First Event
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
