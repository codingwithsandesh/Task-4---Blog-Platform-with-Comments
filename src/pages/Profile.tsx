import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Shield, Calendar, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    setSaving(true);
    try {
      await updateUser(name.trim(), bio.trim() || null);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
      showToast('Profile update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#E7E3DC] pb-6 space-y-1">
        <span className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
          Account Settings
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">
          Author Profile
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Update how your byline and biographical summary appear to readers across BlogSphere.
        </p>
      </div>

      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Profile Avatar & Metadata Header */}
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-serif text-2xl font-bold">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              {user?.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>Role: {user?.role === 'admin' ? 'Editorial Administrator' : 'Contributing Author'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Member since {joinDate}</span>
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-stone-400">Account emails are permanently linked for identity verification.</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">Biographical Deck</label>
              <span className="text-[11px] text-stone-400 font-mono">{bio.length} / 1000</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few sentences about your professional background, research interests, or engineering domains..."
              rows={4}
              maxLength={1000}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] resize-y"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
