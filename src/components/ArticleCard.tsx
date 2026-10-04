import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { BookOpen, MessageSquare } from 'lucide-react';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, featured = false }) => {
  const [imgError, setImgError] = useState(false);

  // Format date cleanly
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  if (featured) {
    return (
      <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 hover:border-stone-300 transition-all duration-200">
        <div className="lg:col-span-7 space-y-4">
          
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
            <span className="text-[#1E3A8A] font-semibold">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.reading_time_minutes} min read</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at || post.created_at}>{formattedDate}</time>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 leading-snug group-hover:text-[#1E3A8A] transition-colors" style={{ textWrap: 'balance' }}>
            <Link to={`/blogs/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-medium text-xs text-stone-700">
                {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">{post.author_name || 'Staff Writer'}</p>
                <p className="text-[11px] text-stone-500">Editorial Contributor</p>
              </div>
            </div>

            {post.comments_count !== undefined && (
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                <span>{post.comments_count}</span>
              </span>
            )}
          </div>
        </div>

        {/* Cover image with Zero-Broken-Image Policy */}
        <div className="lg:col-span-5 h-64 sm:h-80 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
          {post.cover_image_url && !imgError ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-stone-100 to-stone-200/50">
              <BookOpen className="w-10 h-10 text-stone-400 mb-2 stroke-[1.5]" />
              <span className="font-serif italic text-xs text-stone-500 max-w-[200px]">
                {post.category} Discourse
              </span>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white border border-[#E7E3DC] rounded-xl overflow-hidden hover:border-stone-300 transition-all duration-200">
      {/* Cover image slot */}
      <Link to={`/blogs/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-stone-100 relative">
        {post.cover_image_url && !imgError ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-100 to-stone-200/60 text-stone-400">
            <BookOpen className="w-8 h-8 mb-1 stroke-[1.5]" />
            <span className="text-[11px] font-serif italic text-stone-500">{post.category}</span>
          </div>
        )}
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-stone-500">
            <span className="text-[#1E3A8A] font-semibold">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.reading_time_minutes} min read</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at || post.created_at}>{formattedDate}</time>
          </div>

          <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#1E3A8A] transition-colors leading-snug line-clamp-2">
            <Link to={`/blogs/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <span className="font-medium text-stone-800 truncate max-w-[160px]">
            {post.author_name || 'Staff Writer'}
          </span>
          {post.comments_count !== undefined && (
            <span className="flex items-center gap-1 text-[11px] text-stone-400 shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.comments_count}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
