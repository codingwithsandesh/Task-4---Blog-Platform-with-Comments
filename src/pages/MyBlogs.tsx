import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Post } from '../types';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  Filter,
} from 'lucide-react';

export const MyBlogs: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchMyPosts();
  }, [statusFilter]);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getMyPosts({
        status: statusFilter,
        limit: 50,
      });
      if (res.data) {
        setPosts(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load your stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) {
      return;
    }

    try {
      await api.deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      showToast('Article and its comments deleted permanently', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete article', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
            Stories Library
          </span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight mt-1">
            My Articles
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Review your editorial archives, modify existing essays, or continue unfinished drafts.
          </p>
        </div>

        <Link
          to="/blogs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg w-fit text-xs font-medium">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            statusFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Stories
        </button>
        <button
          onClick={() => setStatusFilter('published')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            statusFilter === 'published' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setStatusFilter('draft')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            statusFilter === 'draft' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Content Stream */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-200/70 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white border border-red-200 rounded-xl text-red-600 text-xs">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E7E3DC] rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
          <h3 className="font-serif text-lg font-medium text-stone-800">
            No articles found in this view
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {statusFilter === 'draft'
              ? "You don't have any in-progress drafts at the moment."
              : statusFilter === 'published'
              ? "You haven't published any articles yet."
              : 'Begin your writing journey on BlogSphere today.'}
          </p>
          <Link
            to="/blogs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write an Article</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E3DC] rounded-xl divide-y divide-stone-100 overflow-hidden shadow-xs">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`font-semibold ${
                      post.status === 'published' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500">{post.category}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-400">
                    Created {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  {post.updated_at !== post.created_at && (
                    <>
                      <span className="text-stone-300">·</span>
                      <span className="text-stone-400">
                        Modified {new Date(post.updated_at).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
                  {post.title}
                </h3>

                <p className="text-stone-500 text-xs line-clamp-1">
                  {post.excerpt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Link
                  to={`/blogs/${post.slug}`}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  title="View post"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  to={`/blogs/${post.slug}/edit`}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Edit post"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(post)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
