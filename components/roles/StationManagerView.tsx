'use client';

import { useState, useEffect } from 'react';
import { Heat, HeatStatus } from '@/types';
import { formatDuration } from '@/lib/utils';
import { Play, Pause, RotateCcw, Camera, ChevronRight } from 'lucide-react';

interface StationManagerViewProps {
  heat: Heat;
  onPhaseChange?: (phase: string, timeRemaining: number) => void;
  onComplete?: () => void;
}

type TimerPhase = 'idle' | 'practice' | 'service' | 'cleanup';

export function StationManagerView({ heat, onPhaseChange, onComplete }: StationManagerViewProps) {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState({
    practice: heat.event?.practiceTime || 180,
    service: heat.event?.serviceTime || 300,
    cleanup: heat.event?.cleanupTime || 120,
  });

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
  }, [isRunning, timeRemaining]);

  const startPhase = (newPhase: TimerPhase) => {
    setPhase(newPhase);
    setIsRunning(true);
    
    const duration = settings[newPhase === 'idle' ? 'practice' : newPhase];
    setTimeRemaining(duration);
    
    onPhaseChange?.(newPhase, duration);
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

  const handlePhaseComplete = () => {
    setIsRunning(false);
    
    if (phase === 'practice') {
      startPhase('service');
    } else if (phase === 'service') {
      startPhase('cleanup');
    } else if (phase === 'cleanup') {
      onComplete?.();
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'practice': return 'text-blue-400';
      case 'service': return 'text-amber-400';
      case 'cleanup': return 'text-emerald-400';
      default: return 'text-zinc-400';
    }
  };

  const getPhaseBg = () => {
    switch (phase) {
      case 'practice': return 'bg-blue-500/20 border-blue-500/30';
      case 'service': return 'bg-amber-500/20 border-amber-500/30';
      case 'cleanup': return 'bg-emerald-500/20 border-emerald-500/30';
      default: return 'bg-zinc-800 border-zinc-700';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'practice': return 'Practice Time';
      case 'service': return 'Service Time';
      case 'cleanup': return 'Cleanup Time';
      default: return 'Ready to Start';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className={`p-8 rounded-2xl border-2 ${getPhaseBg()}`}>
        <div className="text-center">
          <div className="mb-4">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
              phase === 'practice' ? 'bg-blue-500 text-white' :
              phase === 'service' ? 'bg-amber-500 text-zinc-950' :
              phase === 'cleanup' ? 'bg-emerald-500 text-white' :
              'bg-zinc-700 text-zinc-300'
            }`}>
              {getPhaseLabel()}
            </span>
          </div>
          
          <div className={`text-7xl font-bold tabular-nums tracking-tight ${getPhaseColor()}`}>
            {formatDuration(timeRemaining)}
          </div>
          
          {/* Progress Bar */}
          {phase !== 'idle' && (
            <div className="mt-6">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    phase === 'practice' ? 'bg-blue-500' :
                    phase === 'service' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ 
                    width: `${((settings[phase] - timeRemaining) / settings[phase]) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-8">
          {phase === 'idle' ? (
            <button
              onClick={() => startPhase('practice')}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5" />
              Start Heat
            </button>
          ) : (
            <>
              {isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="btn-secondary flex items-center gap-2 px-6 py-3"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="btn-outline flex items-center gap-2 px-6 py-3"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Competitor A</p>
          <h3 className="text-lg font-semibold">
            {heat.competitorA?.user?.firstName} {heat.competitorA?.user?.lastName}
          </h3>
        </div>
        
        <div className="card">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Competitor B</p>
          <h3 className="text-lg font-semibold">
            {heat.competitorB?.user?.firstName} {heat.competitorB?.user?.lastName}
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="card card-hover flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            Upload Photos
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>

        <button className="card card-hover flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 
                           flex items-center justify-center text-xs font-bold">✓</span>
            Mark Complete
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Time Settings (Collapsible) */}
      <div className="card">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Phase Durations</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500">Practice</label>
            <input
              type="number"
              value={settings.practice}
              onChange={(e) => setSettings(s => ({ ...s, practice: parseInt(e.target.value) }))}
              className="input-field mt-1"
              disabled={phase !== 'idle'}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Service</label>
            <input
              type="number"
              value={settings.service}
              onChange={(e) => setSettings(s => ({ ...s, service: parseInt(e.target.value) }))}
              className="input-field mt-1"
              disabled={phase !== 'idle'}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Cleanup</label>
            <input
              type="number"
              value={settings.cleanup}
              onChange={(e) => setSettings(s => ({ ...s, cleanup: parseInt(e.target.value) }))}
              className="input-field mt-1"
              disabled={phase !== 'idle'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
