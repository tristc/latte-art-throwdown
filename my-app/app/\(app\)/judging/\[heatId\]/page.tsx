'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Heat, Vote, VoteChoice } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JudgingPage() {
  const params = useParams();
  const router = useRouter();
  const heatId = params.heatId as string;
  
  const [heat, setHeat] = useState<Heat | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState<VoteChoice | null>(null);
  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [totalJudges, setTotalJudges] = useState(0);
  const [votingComplete, setVotingComplete] = useState(false);

  useEffect(() => {
    if (heatId) {
      fetchHeat();
      checkExistingVote();
      fetchVoteCounts();
    }
  }, [heatId]);

  const fetchHeat = async () => {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select(`
          *,
          votes(*),
          judges:judge_assignments(*)
        `)
        .eq('id', heatId)
        .single();

      if (error) throw error;
      setHeat(data);
      setTotalJudges(data.judges?.length || 0);
    } catch (error) {
      console.error('Error fetching heat:', error);
    }
  };

  const checkExistingVote = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('heat_id', heatId)
        .eq('judge_id', session.user.id)
        .single();

      if (data) {
        setHasVoted(true);
        setVoteChoice(data.choice);
      }
    } catch (error) {
      // No existing vote
    }
  };

  const fetchVoteCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('choice')
        .eq('heat_id', heatId);

      if (error) throw error;

      const left = data?.filter(v => v.choice === 'LEFT').length || 0;
      const right = data?.filter(v => v.choice === 'RIGHT').length || 0;
      
      setLeftVotes(left);
      setRightVotes(right);
      
      // Check if all judges have voted
      if (heat && data && data.length >= (heat.judges?.length || 0)) {
        setVotingComplete(true);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const submitVote = async (choice: VoteChoice) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Randomly assign which competitor is left/right
      const competitorAIsLeft = Math.random() > 0.5;

      const { error } = await supabase
        .from('votes')
        .insert({
          heat_id: heatId,
          judge_id: session.user.id,
          choice,
          competitor_a_choice: competitorAIsLeft,
        });

      if (error) throw error;

      setHasVoted(true);
      setVoteChoice(choice);
      fetchVoteCounts();
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote');
    }
  };

  const determineWinner = async () => {
    if (!heat) return;

    const winnerId = leftVotes > rightVotes 
      ? heat.competitorAId 
      : rightVotes > leftVotes 
        ? heat.competitorBId 
        : null;

    if (winnerId) {
      await supabase
        .from('heats')
        .update({ winner_id: winnerId })
        .eq('id', heatId);

      // Advance winner to next heat if applicable
      if (heat.nextHeatId) {
        // Logic to place winner in next heat
      }
    }

    router.push(`/heats/${heatId}`);
  };

  if (!heat) {
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
          <Link 
            href={`/heats/${heatId}`} 
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Heat
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Judging Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Blind Judging</h1>
          <p className="text-zinc-400">Round {heat.round} - Heat {heat.position}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full">
            <span className="text-sm text-zinc-400">Votes: {leftVotes + rightVotes} / {totalJudges}</span>
          </div>
        </div>

        {/* Voting Complete State */}
        {votingComplete ? (
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Voting Complete!</h2>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 bg-zinc-900 rounded-xl">
                <p className="text-zinc-500 text-sm">Cup Left</p>
                <p className="text-3xl font-bold">{leftVotes}</p>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl">
                <p className="text-zinc-500 text-sm">Cup Right</p>
                <p className="text-3xl font-bold">{rightVotes}</p>
              </div>
            </div>
            <button
              onClick={determineWinner}
              className="btn-primary"
            >
              Announce Winner
            </button>
          </div>
        ) : hasVoted ? (
          <div className="card text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Vote Recorded!</h2>
            <p className="text-zinc-400">You chose: Cup {voteChoice}</p>
            <p className="text-sm text-zinc-500 mt-4">
              Waiting for other judges...
            </p>
            <div className="mt-6 p-4 bg-zinc-900 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500">Progress</span>
                <span>{leftVotes + rightVotes} / {totalJudges}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${((leftVotes + rightVotes) / totalJudges) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-zinc-400 mb-6">
              Which cup has better latte art?
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Left Cup */}
              <button
                onClick={() => submitVote('LEFT')}
                className="card card-hover p-8 text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center 
                              group-hover:bg-blue-500/20 transition-colors"
                >
                  <span className="text-4xl font-bold text-zinc-400 group-hover:text-blue-400">L</span>
                </div>
                <p className="text-lg font-semibold">Cup Left</p>
                <p className="text-sm text-zinc-500 mt-2">Select if better</p>
              </button>

              {/* Right Cup */}
              <button
                onClick={() => submitVote('RIGHT')}
                className="card card-hover p-8 text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center 
                              group-hover:bg-blue-500/20 transition-colors"
                >
                  <span className="text-4xl font-bold text-zinc-400 group-hover:text-blue-400">R</span>
                </div>
                <p className="text-lg font-semibold">Cup Right</p>
                <p className="text-sm text-zinc-500 mt-2">Select if better</p>
              </button>
            </div>

            <div className="mt-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-500 text-center">
                <strong className="text-zinc-300">Blind Judging:</strong> You don't know which competitor poured which cup. 
                This ensures fair, unbiased evaluation based purely on the art.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
