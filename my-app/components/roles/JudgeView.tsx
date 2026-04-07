'use client';

import { useState } from 'react';
import { Heat, VoteChoice } from '@/types';
import { Check, X, Eye, EyeOff } from 'lucide-react';

interface JudgeViewProps {
  heat: Heat;
  hasVoted: boolean;
  voteChoice: VoteChoice | null;
  onVote: (choice: VoteChoice) => void;
  leftVotes: number;
  rightVotes: number;
  totalJudges: number;
}

export function JudgeView({ 
  heat, 
  hasVoted, 
  voteChoice, 
  onVote, 
  leftVotes, 
  rightVotes,
  totalJudges 
}: JudgeViewProps) {
  const [showResult, setShowResult] = useState(false);

  if (hasVoted) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-green-500" />
        </div>
        
        <h2 className="text-xl font-bold mb-2">Vote Recorded!</h2>
        <p className="text-zinc-400">You selected: Cup {voteChoice}</p>
        
        <div className="mt-6 p-4 bg-zinc-900 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Voting Progress</span>
            <span className="text-sm">{leftVotes + rightVotes} / {totalJudges}</span>
          </div>
          
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${((leftVotes + rightVotes) / totalJudges) * 100}%` }}
            />
          </div>
        </div>

        {showResult && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900 rounded-xl">
              <p className="text-zinc-500 text-sm">Cup Left</p>
              <p className="text-2xl font-bold">{leftVotes}</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
              <p className="text-zinc-500 text-sm">Cup Right</p>
              <p className="text-2xl font-bold">{rightVotes}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Blind Judging</h2>
        <p className="text-zinc-400">Round {heat.round} - Heat {heat.position}</p>
      </div>

      <p className="text-center text-zinc-400">
        Which cup has better latte art?
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onVote('LEFT')}
          className="card card-hover p-8 text-center group"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center 
                        group-hover:bg-blue-500/20 transition-colors"
          >
            <span className="text-3xl font-bold text-zinc-400 group-hover:text-blue-400">L</span>
          </div>
          <p className="text-lg font-semibold">Cup Left</p>
          <p className="text-sm text-zinc-500 mt-2">Select if better</p>
        </button>

        <button
          onClick={() => onVote('RIGHT')}
          className="card card-hover p-8 text-center group"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center 
                        group-hover:bg-blue-500/20 transition-colors"
          >
            <span className="text-3xl font-bold text-zinc-400 group-hover:text-blue-400">R</span>
          </div>
          <p className="text-lg font-semibold">Cup Right</p>
          <p className="text-sm text-zinc-500 mt-2">Select if better</p>
        </button>
      </div>

      <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <p className="text-sm text-zinc-500 text-center">
          <strong className="text-zinc-300">Blind Judging:</strong> You don't know which competitor 
          poured which cup. This ensures fair, unbiased evaluation.
        </p>
      </div>
    </div>
  );
}
