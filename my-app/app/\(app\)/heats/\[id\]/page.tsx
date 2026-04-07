'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Heat, HeatStatus } from '@/types';
import { formatDuration } from '@/lib/utils';
import { ArrowLeft, Play, Pause, RotateCcw, Camera, Check } from 'lucide-react';
import Link from 'next/link';

type TimerPhase = 'idle' | 'practice' | 'service' | 'cleanup';

export default function HeatPage() {
  const params = useParams();
  const router = useRouter();
  const heatId = params.id as string;
  
  const [heat, setHeat] = useState<Heat | null>(null);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [eventSettings, setEventSettings] = useState({
    practiceTime: 180,
    serviceTime: 300,
    cleanupTime: 120,
  });

  useEffect(() => {
    if (heatId) {
      fetchHeat();
    }
  }, [heatId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, phase]);

  const fetchHeat = async () => {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select(`
          *,
          event:events(practice_time, service_time, cleanup_time),
          competitor_a:competitors!competitor_a_id(
            user:users(first_name, last_name)
          ),
          competitor_b:competitors!competitor_b_id(
            user:users(first_name, last_name)
          )
        `)
        .eq('id', heatId)
        .single();

      if (error) throw error;
      
      setHeat(data);
      setEventSettings({
        practiceTime: data.event?.practice_time || 180,
        serviceTime: data.event?.service_time || 300,
        cleanupTime: data.event?.cleanup_time || 120,
      });
      
      // Restore timer state based on heat status
      if (data.status === 'PRACTICE') {
        setPhase('practice');
        setTimeRemaining(data.practiceEndsAt 
          ? Math.max(0, Math.floor((new Date(data.practiceEndsAt).getTime() - Date.now()) / 1000))
          : data.event?.practice_time || 180
        );
      } else if (data.status === 'SERVICE') {
        setPhase('service');
        setTimeRemaining(data.serviceEndsAt
          ? Math.max(0, Math.floor((new Date(data.serviceEndsAt).getTime() - Date.now()) / 1000))
          : data.event?.service_time || 300
        );
      } else if (data.status === 'CLEANUP') {
        setPhase('cleanup');
        setTimeRemaining(data.cleanupEndsAt
          ? Math.max(0, Math.floor((new Date(data.cleanupEndsAt).getTime() - Date.now()) / 1000))
          : data.event?.cleanup_time || 120
        );
      }
    } catch (error) {
      console.error('Error fetching heat:', error);
    }
  };

  const startPhase = async (newPhase: TimerPhase) => {
    setPhase(newPhase);
    setIsRunning(true);
    
    let duration = 0;
    let status: HeatStatus = 'SCHEDULED';
    
    switch (newPhase) {
      case 'practice':
        duration = eventSettings.practiceTime;
        status = 'PRACTICE';
        break;
      case 'service':
        duration = eventSettings.serviceTime;
        status = 'SERVICE';
        break;
      case 'cleanup':
        duration = eventSettings.cleanupTime;
        status = 'CLEANUP';
        break;
    }
    
    setTimeRemaining(duration);
    
    const endTime = new Date(Date.now() + duration * 1000).toISOString();
    
    await supabase
      .from('heats')
      .update({
        status,
        started_at: newPhase === 'practice' ? new Date().toISOString() : heat?.startedAt,
        [`${newPhase}_ends_at`]: endTime,
      })
      .eq('id', heatId);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeRemaining(0);
  };

  const handlePhaseComplete = async () => {
    setIsRunning(false);
    
    // Auto-advance to next phase
    if (phase === 'practice') {
      await startPhase('service');
    } else if (phase === 'service') {
      await startPhase('cleanup');
    } else if (phase === 'cleanup') {
      await completeHeat();
    }
  };

  const completeHeat = async () => {
    await supabase
      .from('heats')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      })
      .eq('id', heatId);
    
    setPhase('idle');
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'practice':
        return 'text-blue-400';
      case 'service':
        return 'text-amber-400';
      case 'cleanup':
        return 'text-emerald-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getPhaseBg = () => {
    switch (phase) {
      case 'practice':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'service':
        return 'bg-amber-500/20 border-amber-500/30';
      case 'cleanup':
        return 'bg-emerald-500/20 border-emerald-500/30';
      default:
        return 'bg-zinc-800 border-zinc-700';
    }
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
            href={`/events/${heat.eventId}`} 
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Competitors Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-sm text-zinc-500 mb-1">Competitor A</p>
              <h2 className="text-2xl font-bold">
                {heat.competitorA?.user?.first_name} {heat.competitorA?.user?.last_name}
              </h2>
            </div>
            
            <div className="px-6">
              <span className="text-3xl font-bold text-zinc-600">VS</span>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-sm text-zinc-500 mb-1">Competitor B</p>
              <h2 className="text-2xl font-bold">
                {heat.competitorB?.user?.first_name} {heat.competitorB?.user?.last_name}
              </h2>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className={`card ${getPhaseBg()} border-2`}>
          <div className="text-center">
            <div className={`phase-indicator inline-block mb-4 ${
              phase === 'practice' ? 'phase-practice' :
              phase === 'service' ? 'phase-service' :
              phase === 'cleanup' ? 'phase-cleanup' :
              'bg-zinc-700 text-zinc-400'
            }`}>
              {phase === 'idle' ? 'Ready' : phase}
            </div>
            
            <div className={`timer-display ${getPhaseColor()}`}>
              {formatDuration(timeRemaining)}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {phase === 'idle' ? (
              <button
                onClick={() => startPhase('practice')}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Heat
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className="btn-outline flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </>
            )}
          </div>

          {/* Phase Quick Buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => startPhase('practice')}
              disabled={phase !== 'idle'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                phase === 'practice'
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => startPhase('service')}
              disabled={phase === 'idle' || phase === 'cleanup'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                phase === 'service'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Service
            </button>
            <button
              onClick={() => startPhase('cleanup')}
              disabled={phase === 'idle' || phase === 'practice'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                phase === 'cleanup'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Cleanup
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/judging/${heatId}`}
            className="card card-hover text-center"
          >
            <Check className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">Judging Panel</p>
            <p className="text-sm text-zinc-500">Enter blind judging</p>
          </Link>

          <button className="card card-hover text-center">
            <Camera className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Upload Photos</p>
            <p className="text-sm text-zinc-500">Capture pours</p>
          </button>
        </div>
      </main>
    </div>
  );
}
