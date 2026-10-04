import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Post } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Search, PenLine, ArrowRight, Sparkles, Newspaper } from 'lucide-react';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Culture', 'Philosophy', 'Technology'];

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomePosts();
  }, [selectedCategory]);

  const fetchHomePosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPosts({
        limit: 7,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      if (res.data) {
        setPosts(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const leadPost = posts.length > 0 ? posts[0] : null;
  const secondaryPosts = posts.slice(1, 3);
  const tertiaryPosts = posts.slice(3, 7);

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* Editorial Hero Marquee */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India’s Journal for Systems Architecture, Design Craft, & Modern Thought</span>
        </div>

        <h1 
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.12]"
          style={{ textWrap: 'balance' }}
        >
          Ideas Worth Sharing.<br />Stories That Connect.
        </h1>

        <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          An independent editorial sanctuary exploring India Stack breakthroughs, Indic typography, sustainable design, and contemplative engineering across Bharat.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays on India Stack, UPI, Indic typography, passive cooling..."
              className="w-full pl-11 pr-28 py-3.5 bg-white border border-[#E7E3DC] rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Filter Bar (Functional segmented buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-200/60 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Content Stream */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-80 bg-stone-200/70 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-stone-200/70 rounded-xl" />
              <div className="h-64 bg-stone-200/70 rounded-xl" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white border border-red-200 rounded-2xl p-8 space-y-3">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            <button
              onClick={fetchHomePosts}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
            >
              Retry Loading
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E7E3DC] rounded-2xl p-8 space-y-4">
            <Newspaper className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
            <h3 className="font-serif text-xl font-medium text-stone-800">No Stories Published Yet</h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
              Be the first to share an insightful story or technical essay with the BlogSphere community.
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write the First Story</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-14">
            {/* Tier 1: Lead Story Focal Anchor */}
            {leadPost && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E3DC] pb-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
                  <span>Featured Lead Story</span>
                  <span>Vol. {new Date().getFullYear()}</span>
                </div>
                <ArticleCard post={leadPost} featured />
              </section>
            )}

            {/* Tier 2: Secondary Features Grid */}
            {secondaryPosts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E3DC] pb-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
                  <span>Curated Perspectives</span>
                  <Link to="/blogs" className="text-[#1E3A8A] hover:underline flex items-center gap-1 font-semibold normal-case text-xs tracking-normal">
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {secondaryPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Tier 3: Department List */}
            {tertiaryPosts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E3DC] pb-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
                  <span>Recent Publications</span>
                  <Link to="/blogs" className="text-stone-500 hover:text-stone-900 transition-colors">
                    Archive List →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tertiaryPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Clear Call to Action for writing a blog */}
        <section className="bg-stone-900 text-white rounded-2xl p-8 sm:p-12 mt-16 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Open Authorship Platform
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-snug">
              Have insights or architecture lessons to impart?
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Join our community of engineers, designers, and essayists. Publish your articles with zero friction, beautiful typography, and engaging comments.
            </p>
            <div className="pt-2">
              <Link
                to="/blogs/new"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-lg transition-colors shadow-sm"
              >
                <PenLine className="w-4 h-4 text-stone-900" />
                <span>Start Writing Today</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
