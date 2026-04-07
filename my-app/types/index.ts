import { UserRole, EventFormat, HeatStatus, VoteChoice, SponsorTier } from '@prisma/client';

export type { UserRole, EventFormat, HeatStatus, VoteChoice, SponsorTier };

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  format: EventFormat;
  practiceTime: number;
  serviceTime: number;
  cleanupTime: number;
  votingEnabled: boolean;
  votingEndsAt?: Date;
  directorId: string;
  hostId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Competitor {
  id: string;
  userId: string;
  eventId: string;
  nickname?: string;
  bio?: string;
  photoUrl?: string;
  seed?: number;
  user?: User;
}

export interface Heat {
  id: string;
  eventId: string;
  competitorAId: string;
  competitorBId: string;
  competitorA?: Competitor;
  competitorB?: Competitor;
  round: number;
  position: number;
  nextHeatId?: string;
  status: HeatStatus;
  scheduledTime?: Date;
  startedAt?: Date;
  practiceEndsAt?: Date;
  serviceEndsAt?: Date;
  cleanupEndsAt?: Date;
  completedAt?: Date;
  winnerId?: string;
  votes?: Vote[];
  photos?: Photo[];
}

export interface Vote {
  id: string;
  heatId: string;
  judgeId: string;
  choice: VoteChoice;
  competitorAChoice: boolean;
  createdAt: Date;
}

export interface Photo {
  id: string;
  heatId: string;
  competitorId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  uploadedById: string;
  uploadedAt: Date;
  publicVotes?: PublicVote[];
}

export interface PublicVote {
  id: string;
  photoId: string;
  voterId: string;
  createdAt: Date;
}

export interface Bracket {
  id: string;
  eventId: string;
  structure: unknown;
  championId?: string;
  runnerUpId?: string;
}

export interface Sponsor {
  id: string;
  eventId: string;
  name: string;
  tier: SponsorTier;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

export interface TimerState {
  phase: 'practice' | 'service' | 'cleanup' | 'idle';
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
}

export interface JudgingResult {
  heatId: string;
  leftVotes: number;
  rightVotes: number;
  winnerChoice: VoteChoice;
  winnerCompetitorId: string;
}
