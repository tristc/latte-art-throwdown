'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, UserRole } from '@/types';
import { getRoleDisplayName } from '@/lib/utils';
import { Camera, Mail, User as UserIcon, Award } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user?.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      setUser({ ...user!, avatarUrl: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Please sign in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-zinc-300"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold mt-2">Your Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="card">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-zinc-600" />
                )}
              </div>
              
              <label className={`absolute bottom-0 right-0 w-8 h-8 rounded-full 
                              flex items-center justify-center cursor-pointer
                              ${uploading ? 'bg-zinc-700' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                <Camera className="w-4 h-4 text-zinc-950" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="text-xl font-bold mt-4">
              {user.firstName} {user.lastName}
            </h2>
            
            <div className="flex items-center gap-2 mt-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-400">{getRoleDisplayName(user.role)}</span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-zinc-500">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-zinc-500">Events</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-zinc-500">Competitions</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-zinc-500">Wins</p>
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 className="font-semibold mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500">Email</label>
              <p>{user.email}</p>
            </div>
            
            <div>
              <label className="text-sm text-zinc-500">Role</label>
              <p>{getRoleDisplayName(user.role)}</p>
            </div>
            
            <div>
              <label className="text-sm text-zinc-500">Member Since</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
