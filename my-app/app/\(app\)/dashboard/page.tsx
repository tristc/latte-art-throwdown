'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, Event, HeatStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Users, Trophy, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchEvents();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profile) {
      setUser(profile);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(5);
      
      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold gradient-text">Dashboard</h1>
            <p className="text-sm text-zinc-500">
              Welcome back, {user?.firstName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm py-2 px-4"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/events/create" className="card card-hover">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Create Event</span>
            </div>
          </Link>

          <Link href="/events" className="card card-hover">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">All Events</span>
            </div>
          </Link>

          <Link href="/profile" className="card card-hover">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-sm font-medium">Profile</span>
            </div>
          </Link>

          <Link href="/brackets" className="card card-hover">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Brackets</span>
            </div>
          </Link>
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-amber-500 hover:text-amber-400">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {events.length > 0 ? (
              events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="card card-hover flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium text-zinc-100">{event.name}</h3>
                    <p className="text-sm text-zinc-500">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-300">
                      {formatDate(new Date(event.startDate))}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.format === 'MATCH_PATTERN' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {event.format === 'MATCH_PATTERN' ? 'Match Pattern' : 'Freestyle'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="card text-center py-12">
                <p className="text-zinc-500">No upcoming events</p>
                <Link href="/events/create" className="btn-primary inline-block mt-4">
                  Create Event
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
