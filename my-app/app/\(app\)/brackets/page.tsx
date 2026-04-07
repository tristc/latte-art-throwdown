'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Event, Bracket } from '@/types';
import { Trophy, ChevronRight } from 'lucide-react';

interface BracketMatch {
  id: string;
  round: number;
  position: number;
  competitorA?: { id: string; name: string };
  competitorB?: { id: string; name: string };
  winner?: { id: string; name: string };
}

export default function BracketsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [brackets, setBrackets] = useState<Record<string, BracketMatch[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsWithBrackets();
  }, []);

  const fetchEventsWithBrackets = async () => {
    try {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (eventsData) {
        setEvents(eventsData);

        // Fetch brackets for each event
        for (const event of eventsData) {
          const { data: heats } = await supabase
            .from('heats')
            .select(`
              *,
              competitor_a:competitors!competitor_a_id(
                user:users(first_name, last_name)
              ),
              competitor_b:competitors!competitor_b_id(
                user:users(first_name, last_name)
              ),
              winner:competitors!winner_id(
                user:users(first_name, last_name)
              )
            `)
            .eq('event_id', event.id)
            .order('round', { ascending: true })
            .order('position', { ascending: true });

          if (heats) {
            const matches: BracketMatch[] = heats.map((heat: Heat) => ({
              id: heat.id,
              round: heat.round,
              position: heat.position,
              competitorA: heat.competitorA ? {
                id: heat.competitorAId,
                name: `${heat.competitorA.user?.first_name} ${heat.competitorA.user?.last_name}`,
              } : undefined,
              competitorB: heat.competitorB ? {
                id: heat.competitorBId,
                name: `${heat.competitorB.user?.first_name} ${heat.competitorB.user?.last_name}`,
              } : undefined,
              winner: heat.winnerId ? {
                id: heat.winnerId,
                name: heat.winner ? `${heat.winner.user?.first_name} ${heat.winner.user?.last_name}` : 'Unknown',
              } : undefined,
            }));
            
            setBrackets(prev => ({ ...prev, [event.id]: matches }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching brackets:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBracket = (matches: BracketMatch[]) => {
    const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
    
    return (
      <div className="flex gap-8 overflow-x-auto pb-4">
        {rounds.map((round) => {
          const roundMatches = matches.filter(m => m.round === round);
          
          return (
            <div key={round} className="flex flex-col justify-center min-w-[200px]">
              <h3 className="text-sm font-medium text-zinc-500 mb-4 text-center">
                {round === rounds.length ? 'Final' : `Round ${round}`}
              </h3>
              
              <div className="space-y-4">
                {roundMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/heats/${match.id}`}
                    className="block bg-zinc-900 rounded-lg p-3 border border-zinc-800 
                             hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 text-sm ${
                        match.winner?.id === match.competitorA?.id 
                          ? 'text-amber-400 font-medium' 
                          : 'text-zinc-400'
                      }`}>
                        <span className="flex-1 truncate">
                          {match.competitorA?.name || 'TBD'}
                        </span>
                        {match.winner?.id === match.competitorA?.id && (
                          <Trophy className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="h-px bg-zinc-800" />
                      
                      <div className={`flex items-center gap-2 text-sm ${
                        match.winner?.id === match.competitorB?.id 
                          ? 'text-amber-400 font-medium' 
                          : 'text-zinc-400'
                      }`}>
                        <span className="flex-1 truncate">
                          {match.competitorB?.name || 'TBD'}
                        </span>
                        {match.winner?.id === match.competitorB?.id && (
                          <Trophy className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
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
          <h1 className="text-2xl font-bold mt-2">Tournament Brackets</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {events.map((event) => (
          <section key={event.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p className="text-sm text-zinc-500">{event.location}</p>
              </div>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
              >
                View Event
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {brackets[event.id]?.length > 0 ? (
              renderBracket(brackets[event.id])
            ) : (
              <p className="text-zinc-500 text-center py-8">No bracket generated yet</p>
            )}
          </section>
        ))}
        
        {events.length === 0 && (
          <div className="card text-center py-12">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-lg font-medium mb-2">No Events Yet</h2>
            <p className="text-zinc-500 mb-4">Create an event to see tournament brackets</p>
            <Link href="/events/create" className="btn-primary inline-block">
              Create Event
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
