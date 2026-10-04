import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import {
  PenSquare,
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Edit,
  ExternalLink,
  User as UserIcon,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
            Author Workspace
          </span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight mt-1">
            Welcome back, {user?.name || 'Author'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Manage your articles, drafts, audience discourse, and profile settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link
            to="/blogs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write New Story</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-600">Total Articles</span>
            <BookOpen className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            {loading ? '—' : stats?.totalPosts || 0}
          </div>
          <p className="text-[11px] text-stone-400">All authored posts</p>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-600">Published</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            {loading ? '—' : stats?.publishedPosts || 0}
          </div>
          <p className="text-[11px] text-stone-400">Publicly accessible</p>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-600">Private Drafts</span>
            <PenSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            {loading ? '—' : stats?.draftPosts || 0}
          </div>
          <p className="text-[11px] text-stone-400">In-progress stories</p>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-600">Comments</span>
            <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            {loading ? '—' : stats?.commentsReceived || 0}
          </div>
          <p className="text-[11px] text-stone-400">Community replies received</p>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white border border-[#E7E3DC] rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Recent Editorial Work
          </h2>
          <Link
            to="/my-blogs"
            className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
          >
            <span>View all stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading your articles...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : !stats?.recentPosts || stats.recentPosts.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-stone-300 mx-auto stroke-[1.5]" />
            <p className="text-xs text-stone-500">You haven't written any articles yet.</p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Create your first post</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {stats.recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium">
                    <span
                      className={
                        post.status === 'published'
                          ? 'text-emerald-700 font-semibold'
                          : 'text-amber-700 font-semibold'
                      }
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-400">
                      Updated {new Date(post.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Link
                    to={`/blogs/${post.slug}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Edit className="w-3 h-3 text-stone-500" />
                    <span>Edit</span>
                  </Link>

                  <Link
                    to={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
