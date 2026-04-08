'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Photo, Event } from '@/types';
import { Heart, Trophy, Camera } from 'lucide-react';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<(Photo & { event: Event; votes: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPhotos();
    fetchUserVotes();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          event:events(*),
          public_votes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const photosWithVotes = (data || []).map((photo) => ({
        ...photo,
        votes: photo.public_votes?.length || 0,
      }));

      setPhotos(photosWithVotes);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('public_votes')
        .select('photo_id')
        .eq('voter_id', session.user.id);

      if (error) throw error;

      setUserVotes(new Set(data?.map((v) => v.photo_id) || []));
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const voteForPhoto = async (photoId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to vote');
        return;
      }

      if (userVotes.has(photoId)) {
        // Remove vote
        await supabase
          .from('public_votes')
          .delete()
          .eq('photo_id', photoId)
          .eq('voter_id', session.user.id);

        setUserVotes((prev) => {
          const next = new Set(prev);
          next.delete(photoId);
          return next;
        });
      } else {
        // Add vote
        await supabase
          .from('public_votes')
          .insert({
            photo_id: photoId,
            voter_id: session.user.id,
          });

        setUserVotes((prev) => new Set([...prev, photoId]));
      }

      fetchPhotos();
    } catch (error) {
      console.error('Error voting:', error);
    }
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
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-2">
            <Camera className="w-6 h-6" />
            People's Choice
          </h1>
          <p className="text-zinc-500">Vote for your favorite latte art</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="card overflow-hidden">
              <div className="aspect-square bg-zinc-800 -mx-6 -mt-6 mb-4">
                <img
                  src={photo.imageUrl}
                  alt="Latte art"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{photo.event?.name}</p>
                  <p className="text-sm text-zinc-500">{photo.votes} votes</p>
                </div>

                <button
                  onClick={() => voteForPhoto(photo.id)}
                  className={`p-3 rounded-full transition-colors ${
                    userVotes.has(photo.id)
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${userVotes.has(photo.id) ? 'fill-current' : ''}`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="card text-center py-12">
            <Camera className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-lg font-medium mb-2">No Photos Yet</h2>
            <p className="text-zinc-500">Photos will appear here after events</p>
          </div>
        )}
      </main>
    </div>
  );
}
