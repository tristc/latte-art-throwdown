'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Event, Competitor, Heat } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Users, Clock, MapPin, Trophy, Plus, Play } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDirector, setIsDirector] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchCompetitors();
      fetchHeats();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);

      // Check if current user is director
      const { data: { session } } = await supabase.auth.getSession();
      setIsDirector(session?.user?.id === data.director_id);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const fetchCompetitors = async () => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select(`
          *,
          user:users(first_name, last_name, avatar_url)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setCompetitors(data || []);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeats = async () => {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select(`
          *,
          competitor_a:competitors!competitor_a_id(user:users(first_name, last_name)),
          competitor_b:competitors!competitor_b_id(user:users(first_name, last_name))
        `)
        .eq('event_id', eventId)
        .order('round', { ascending: true })
        .order('position', { ascending: true });

      if (error) throw error;
      setHeats(data || []);
    } catch (error) {
      console.error('Error fetching heats:', error);
    }
  };

  const registerAsCompetitor = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('competitors')
        .insert({
          user_id: session.user.id,
          event_id: eventId,
        });

      if (error) throw error;
      
      fetchCompetitors();
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register');
    }
  };

  const generateBracket = async () => {
    try {
      const { error } = await supabase
        .rpc('generate_bracket', { event_id: eventId });

      if (error) throw error;
      
      fetchHeats();
      alert('Bracket generated successfully!');
    } catch (error) {
      console.error('Error generating bracket:', error);
      alert('Failed to generate bracket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Event Header */}
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
              <p className="text-zinc-400 mb-4">{event.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {formatDateTime(new Date(event.startDate))}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Trophy className="w-4 h-4" />
                  {event.format === 'MATCH_PATTERN' ? 'Match Pattern' : 'Freestyle'}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {isDirector && (
                <button
                  onClick={generateBracket}
                  className="btn-primary flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Generate Bracket
                </button>
              )}
              <button
                onClick={registerAsCompetitor}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Register as Competitor
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Competitors */}
          <section className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Competitors ({competitors.length})
              </h2>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    {competitor.user?.avatar_url ? (
                      <img
                        src={competitor.user.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">
                        {(competitor.user?.first_name?.[0] || '?')}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {competitor.user?.first_name} {competitor.user?.last_name}
                    </p>
                    {competitor.nickname && (
                      <p className="text-sm text-zinc-500">"{competitor.nickname}"</p>
                    )}
                  </div>
                </div>
              ))}
              {competitors.length === 0 && (
                <p className="text-zinc-500 text-center py-8">No competitors yet</p>
              )}
            </div>
          </section>

          {/* Heats */}
          <section className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Heats
              </h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {heats.map((heat) => (
                <Link
                  key={heat.id}
                  href={`/heats/${heat.id}`}
                  className="block p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-500">
                      Round {heat.round} - Heat {heat.position}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      heat.status === 'COMPLETED' 
                        ? 'bg-green-500/20 text-green-400'
                        : heat.status === 'SCHEDULED'
                        ? 'bg-zinc-700 text-zinc-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {heat.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {heat.competitor_a?.user?.first_name || 'TBD'} vs {heat.competitor_b?.user?.first_name || 'TBD'}
                    </div>
                    <Play className="w-4 h-4 text-amber-500" />
                  </div>
                </Link>
              ))}
              {heats.length === 0 && (
                <p className="text-zinc-500 text-center py-8">No heats yet</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
