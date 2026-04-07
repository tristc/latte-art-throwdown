import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function generateBracket(players: { id: string; seed?: number }[]): unknown {
  // Sort by seed if available, otherwise random
  const sorted = [...players].sort((a, b) => (a.seed || 999) - (b.seed || 999));
  
  // Generate single elimination bracket
  const rounds: unknown[] = [];
  let currentRound = sorted;
  
  while (currentRound.length > 1) {
    const nextRound: unknown[] = [];
    const matches: unknown[] = [];
    
    for (let i = 0; i < currentRound.length; i += 2) {
      matches.push({
        id: `match-${rounds.length}-${i / 2}`,
        player1: currentRound[i],
        player2: currentRound[i + 1] || null,
        winner: null,
      });
      nextRound.push({ id: `winner-${rounds.length}-${i / 2}` });
    }
    
    rounds.push({ round: rounds.length + 1, matches });
    currentRound = nextRound;
  }
  
  return { rounds };
}

export function getRoleDisplayName(role: string): string {
  const displayNames: Record<string, string> = {
    EVENT_DIRECTOR: 'Event Director',
    SPONSOR_TIER_1: 'Sponsor (Premier)',
    SPONSOR_TIER_2: 'Sponsor (Partner)',
    SPONSOR_TIER_3: 'Sponsor (Supporter)',
    HOST: 'Host',
    CO_HOST: 'Co-Host',
    STATION_MANAGER: 'Station Manager',
    RESET_CREW: 'Reset Crew',
    VOLUNTEER: 'Volunteer',
    VISUAL_JUDGE: 'Visual Judge',
    GENERAL_MEMBER: 'Member',
    COMPETITOR: 'Competitor',
    COACH: 'Coach',
    COMPETITOR_ASSISTANT: 'Assistant',
    EMCEE: 'Emcee',
  };
  return displayNames[role] || role;
}

export function isRoleHigher(role1: string, role2: string): boolean {
  const hierarchy: Record<string, number> = {
    EVENT_DIRECTOR: 100,
    HOST: 90,
    CO_HOST: 80,
    STATION_MANAGER: 70,
    EMCEE: 60,
    VISUAL_JUDGE: 50,
    COMPETITOR: 40,
    COACH: 35,
    COMPETITOR_ASSISTANT: 30,
    RESET_CREW: 20,
    VOLUNTEER: 10,
    GENERAL_MEMBER: 5,
    SPONSOR_TIER_1: 0,
    SPONSOR_TIER_2: 0,
    SPONSOR_TIER_3: 0,
  };
  return (hierarchy[role1] || 0) > (hierarchy[role2] || 0);
}
