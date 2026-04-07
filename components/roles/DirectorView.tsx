'use client';

import { useState } from 'react';
import { Event, Competitor, Heat } from '@/types';
import { Users, Trophy, Settings, BarChart3 } from 'lucide-react';

interface DirectorViewProps {
  event: Event;
  competitors: Competitor[];
  heats: Heat[];
  onGenerateBracket: () => void;
  onAddJudge: (heatId: string, judgeId: string) => void;
  onAdvanceWinner: (heatId: string, winnerId: string) => void;
}

export function DirectorView({ 
  event, 
  competitors, 
  heats,
  onGenerateBracket,
  onAddJudge,
  onAdvanceWinner 
}: DirectorViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'heats' | 'settings'>('overview');

  const completedHeats = heats.filter(h => h.status === 'COMPLETED');
  const inProgressHeats = heats.filter(h => ['PRACTICE', 'SERVICE', 'CLEANUP'].includes(h.status));
  const pendingHeats = heats.filter(h => h.status === 'SCHEDULED');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'heats', label: 'Heats', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                        whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold">{competitors.length}</p>
              <p className="text-sm text-zinc-500">Competitors</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold">{heats.length}</p>
              <p className="text-sm text-zinc-500">Total Heats</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold">{completedHeats.length}</p>
              <p className="text-sm text-zinc-500">Completed</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold">{inProgressHeats.length}</p>
              <p className="text-sm text-zinc-500">In Progress</p>
            </div>
          </div>

          {heats.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-zinc-500 mb-4">No bracket generated yet</p>
              <button
                onClick={onGenerateBracket}
                className="btn-primary"
              >
                Generate Bracket
              </button>
            </div>
          )}
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Registered Competitors ({competitors.length})</h3>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg"
              >
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  {competitor.user?.avatarUrl ? (
                    <img
                      src={competitor.user.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {(competitor.user?.firstName?.[0] || '?')}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {competitor.user?.firstName} {competitor.user?.lastName}
                  </p>
                  {competitor.nickname && (
                    <p className="text-sm text-zinc-500">"{competitor.nickname}"</p>
                  )}
                </div>
              </div>
            ))}
            {competitors.length === 0 && (
              <p className="text-zinc-500 text-center py-8">No competitors registered yet</p>
            )}
          </div>
        </div>
      )}

      {/* Heats Tab */}
      {activeTab === 'heats' && (
        <div className="space-y-4">
          {heats.map((heat) => (
            <div key={heat.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-500">
                  Round {heat.round} - Heat {heat.position}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  heat.status === 'COMPLETED' 
                    ? 'bg-green-500/20 text-green-400'
                    : heat.status === 'SCHEDULED'
                    ? 'bg-zinc-700 text-zinc-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
                >
                  {heat.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {heat.competitorA?.user?.firstName || 'TBD'} vs {heat.competitorB?.user?.firstName || 'TBD'}
                </div>
                
                {heat.winnerId && (
                  <span className="text-amber-400 text-sm">
                    Winner: {heat.winnerId === heat.competitorAId 
                      ? heat.competitorA?.user?.firstName 
                      : heat.competitorB?.user?.firstName}
                  </span>
                )}
              </div>
            </div>
          ))}
          {heats.length === 0 && (
            <p className="text-zinc-500 text-center py-8">No heats generated yet</p>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card space-y-4">
          <h3 className="font-semibold">Event Settings</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-zinc-500">Practice Time (seconds)</label>
                <input
                  type="number"
                  defaultValue={event.practiceTime}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-500">Service Time (seconds)</label>
                <input
                  type="number"
                  defaultValue={event.serviceTime}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-500">Cleanup Time (seconds)</label>
                <input
                  type="number"
                  defaultValue={event.cleanupTime}
                  className="input-field mt-1"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-zinc-800">
              <h4 className="font-medium mb-2">Danger Zone</h4>
              <button className="text-red-400 hover:text-red-300 text-sm">
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
