import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Post } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Culture', 'Philosophy', 'Technology'];

export const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query states
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<'newest' | 'oldest'>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [category, sort, page]);

  // Sync state to URL
  const updateUrlParams = (newParams: Record<string, string>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) updated.set(k, v);
      else updated.delete(k);
    });
    setSearchParams(updated);
  };

  const fetchPosts = async (customSearch?: string) => {
    setLoading(true);
    setError(null);
    const searchTerm = customSearch !== undefined ? customSearch : search;

    try {
      const res = await api.getPosts({
        page,
        limit: 9,
        search: searchTerm,
        category: category !== 'All' ? category : undefined,
        sort,
      });

      if (res.data) {
        setPosts(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalCount(res.pagination.total);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search, page: '1' });
    fetchPosts(search);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    updateUrlParams({ category: cat !== 'All' ? cat : '', page: '1' });
  };

  const handleSortChange = (newSort: 'newest' | 'oldest') => {
    setSort(newSort);
    setPage(1);
    updateUrlParams({ sort: newSort, page: '1' });
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
    fetchPosts('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Editorial Header */}
      <div className="space-y-3 border-b border-[#E7E3DC] pb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Explore Articles & Discourse
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl leading-relaxed">
          Search across our catalogue of essays, technical deep-dives, architectural analyses, and design commentaries.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-[#E7E3DC] rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, title, or topic..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-100">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Reset */}
          <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
            <div className="flex items-center gap-1.5 text-stone-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {(search || category !== 'All' || sort !== 'newest') && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors pl-2 border-l border-stone-200"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      {!loading && (
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>
            Showing <strong className="text-stone-800 tabular-nums">{posts.length}</strong> of{' '}
            <strong className="text-stone-800 tabular-nums">{totalCount}</strong> articles
          </span>
          {category !== 'All' && <span>Filtered by: {category}</span>}
        </div>
      )}

      {/* Grid or Skeletons or Empty */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E7E3DC] rounded-xl h-80 p-6 space-y-4">
              <div className="w-full h-36 bg-stone-200/70 rounded-lg" />
              <div className="w-1/3 h-4 bg-stone-200/70 rounded" />
              <div className="w-3/4 h-5 bg-stone-200/70 rounded" />
              <div className="w-full h-4 bg-stone-200/50 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white border border-red-200 rounded-2xl p-8 space-y-3">
          <p className="text-red-700 font-medium text-sm">{error}</p>
          <button
            onClick={() => fetchPosts()}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
          >
            Retry Fetching
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E3DC] rounded-2xl p-8 space-y-4">
          <Newspaper className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
          <h3 className="font-serif text-xl font-medium text-stone-800">No Matching Articles Found</h3>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            We couldn't find any articles matching your search criteria. Try modifying your search term or resetting the filters.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t border-[#E7E3DC]">
          <button
            onClick={() => {
              const newPage = Math.max(1, page - 1);
              setPage(newPage);
              updateUrlParams({ page: newPage.toString() });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-stone-600 font-medium tabular-nums">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => {
              const newPage = Math.min(totalPages, page + 1);
              setPage(newPage);
              updateUrlParams({ page: newPage.toString() });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
