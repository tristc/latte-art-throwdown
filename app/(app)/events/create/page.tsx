'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    format: 'MATCH_PATTERN',
    practiceTime: 180,
    serviceTime: 300,
    cleanupTime: 120,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);

      const { data, error } = await supabase
        .from('events')
        .insert({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          start_date: startDateTime.toISOString(),
          format: formData.format,
          practice_time: formData.practiceTime,
          service_time: formData.serviceTime,
          cleanup_time: formData.cleanupTime,
          director_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/events/${data.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="btn-secondary p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Create Event</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-300">
              Event Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Spring Latte Art Throwdown 2025"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[100px]"
              placeholder="Tell us about your event..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-zinc-300">
              Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="123 Coffee St, Portland, OR"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium text-zinc-300">
                Date *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium text-zinc-300">
                Time *
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="format" className="text-sm font-medium text-zinc-300">
              Competition Format *
            </label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="input-field"
            >
              <option value='MATCH_PATTERN'>Match Pattern</option>
              <option value='FREESTYLE'>Freestyle</option>
            </select>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <h3 className="text-lg font-medium mb-4">Timing Settings</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="practiceTime" className="text-sm font-medium text-zinc-300">
                  Practice (sec)
                </label>
                <input
                  id="practiceTime"
                  name="practiceTime"
                  type="number"
                  value={formData.practiceTime}
                  onChange={handleChange}
                  className="input-field"
                  min={0}
                  step={30}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="serviceTime" className="text-sm font-medium text-zinc-300">
                  Service (sec)
                </label>
                <input
                  id="serviceTime"
                  name="serviceTime"
                  type="number"
                  value={formData.serviceTime}
                  onChange={handleChange}
                  className="input-field"
                  min={0}
                  step={30}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cleanupTime" className="text-sm font-medium text-zinc-300">
                  Cleanup (sec)
                </label>
                <input
                  id="cleanupTime"
                  name="cleanupTime"
                  type="number"
                  value={formData.cleanupTime}
                  onChange={handleChange}
                  className="input-field"
                  min={0}
                  step={30}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/dashboard" className="flex-1 btn-secondary text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
