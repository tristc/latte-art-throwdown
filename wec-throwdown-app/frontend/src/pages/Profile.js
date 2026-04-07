import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Instagram, Award } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    instagramHandle: user?.instagramHandle || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B4513] to-amber-700 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.displayName || `${user?.firstName} ${user?.lastName}`}</h1>
              <p className="text-amber-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Name</span>
                  </div>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium">{user?.email}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Skill Level</span>
                  </div>
                  <p className="font-medium capitalize">{user?.skillLevel}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <Instagram className="h-4 w-4" />
                    <span className="text-sm">Instagram</span>
                  </div>
                  <p className="font-medium">{user?.instagramHandle || '—'}</p>
                </div>
              </div>

              {user?.bio && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bio</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}

              <button
                onClick={() => setEditing(true)}
                className="bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
