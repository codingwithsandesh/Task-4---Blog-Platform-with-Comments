import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Share2,
  Check,
  MessageSquare,
  Send,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  BookOpen,
  Edit3,
} from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Share state
  const [copied, setCopied] = useState(false);
  const [coverImgError, setCoverImgError] = useState(false);

  // Related posts
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (slug) {
      loadArticleData(slug);
    }
  }, [slug]);

  const loadArticleData = async (articleSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPostBySlug(articleSlug);
      if (res.data) {
        setPost(res.data);
        // Load comments
        const commentsRes = await api.getComments(res.data.id);
        if (commentsRes.data) {
          setComments(commentsRes.data);
        }

        // Load related posts by category
        api.getPosts({ limit: 3, category: res.data.category })
          .then((relatedRes) => {
            if (relatedRes.data) {
              setRelatedPosts(relatedRes.data.filter((p) => p.id !== res.data?.id).slice(0, 2));
            }
          })
          .catch(() => {});
      } else {
        setError('Article not found');
      }
    } catch (err: any) {
      setError(err.message || 'The requested article could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Article link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (!user) {
      navigate(`/login?redirect=/blogs/${post.slug}`);
      return;
    }

    const content = newComment.trim();
    if (content.length < 2) {
      setCommentError('Comment must be at least 2 characters long.');
      return;
    }

    setCommentSubmitting(true);
    setCommentError(null);
    try {
      const res = await api.addComment(post.id, content);
      if (res.data) {
        setComments((prev) => [...prev, res.data!]);
        setNewComment('');
        showToast('Your comment has been published!', 'success');
      }
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post comment. Please try again.');
      showToast('Failed to post comment', 'error');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast('Comment deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="h-12 w-full bg-stone-200 rounded-lg" />
        <div className="h-4 w-48 bg-stone-200 rounded" />
        <div className="h-96 w-full bg-stone-200 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full" />
          <div className="h-4 bg-stone-200 rounded w-5/6" />
          <div className="h-4 bg-stone-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-stone-400 mx-auto stroke-[1.2]" />
        <h1 className="font-serif text-2xl font-semibold text-stone-900">Article Not Found</h1>
        <p className="text-stone-500 text-sm">
          {error || "The article you're seeking may have been removed, drafted, or renamed."}
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Articles</span>
        </Link>
      </div>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const isAuthor = user && user.id === post.author_id;

  return (
    <div className="py-10 space-y-12">
      
      {/* Top Navigation Affordance */}
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Articles</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthor && (
            <Link
              to={`/blogs/${post.slug}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            title="Share this article"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* Article Header */}
        <header className="space-y-4 border-b border-[#E7E3DC] pb-8">
          
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
            <span className="text-[#1E3A8A] font-semibold">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              <time dateTime={post.published_at || post.created_at}>{formattedDate}</time>
            </span>
            {post.status === 'draft' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-semibold">[Private Draft]</span>
              </>
            )}
          </div>

          <h1 
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.18]"
            style={{ textWrap: 'balance' }}
          >
            {post.title}
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-stone-600 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Byline Lockup */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-semibold text-sm">
                {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{post.author_name || 'Staff Writer'}</p>
                <p className="text-xs text-stone-500">{post.author_bio || 'Editorial Contributor'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image Presentation */}
        {post.cover_image_url && !coverImgError && (
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs">
            <img
              src={post.cover_image_url}
              alt={post.title}
              referrerPolicy="no-referrer"
              onError={() => setCoverImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body Prose constrained to 65-75ch (max-w-2xl) with relaxed line height */}
        <div className="font-sans text-stone-800 text-base sm:text-lg leading-[1.8] space-y-6 pt-2">
          {post.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Handle Markdown-style headers
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="font-serif text-2xl font-semibold text-stone-900 pt-6 pb-1">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="font-serif text-3xl font-semibold text-stone-900 pt-8 pb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={index} className="border-l-2 border-[#1E3A8A] pl-5 italic text-stone-700 my-6 font-serif text-xl">
                  {trimmed.replace('> ', '')}
                </blockquote>
              );
            }

            // Numbered list items
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split('\n');
              return (
                <ol key={index} className="list-decimal pl-6 space-y-2 text-stone-700">
                  {items.map((item, itemIdx) => {
                    const cleanItem = item.replace(/^\d+\.\s*/, '');
                    return <li key={itemIdx}>{cleanItem}</li>;
                  })}
                </ol>
              );
            }

            // Opening paragraph drop-cap on index 0
            if (index === 0) {
              return (
                <p key={index} className="drop-cap text-stone-800">
                  {trimmed}
                </p>
              );
            }

            return (
              <p key={index} className="text-stone-800">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags footer */}
        {post.tags && (
          <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-medium text-stone-700">Indexed under:</span>
            {post.tags.split(',').map((tag, idx) => (
              <span key={idx} className="text-stone-600">
                #{tag.trim()}
                {idx < post.tags!.split(',').length - 1 && <span className="ml-2" aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10">
          <div className="w-14 h-14 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
            {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Published by {post.author_name || 'Staff Writer'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {post.author_bio ||
                'Contributor at BlogSphere writing on systems architecture, craftsmanship, and technology.'}
            </p>
          </div>
        </div>

      </article>

      {/* Comments System Section */}
      <section className="max-w-3xl mx-auto px-4 pt-10 border-t border-[#E7E3DC] space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Community Discourse
            </h2>
            <span className="text-xs font-semibold text-stone-500 ml-1 tabular-nums">
              ({comments.length})
            </span>
          </div>
        </div>

        {/* Comment submission form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Writing as <strong className="text-stone-800">{user.name}</strong></span>
              <span className="tabular-nums">{newComment.length} / 1500 chars</span>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Contribute your perspective or question to the discussion..."
              rows={3}
              maxLength={1500}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all resize-y"
            />

            {commentError && (
              <p className="text-xs text-red-600 font-medium">{commentError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting || newComment.trim().length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{commentSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 text-center space-y-3">
            <p className="text-stone-700 text-sm">
              Join the conversation. Sign in to post thoughtful replies.
            </p>
            <Link
              to={`/login?redirect=/blogs/${post.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
            >
              Sign In to Comment
            </Link>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="font-serif italic text-stone-500 text-sm">
              No comments have been posted yet. Be the first to start the discussion!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentAuthor = user && (user.id === comment.user_id || user.role === 'admin');
              const commentDate = new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={comment.id}
                  className="bg-white border border-[#E7E3DC] rounded-xl p-5 space-y-3 transition-colors hover:border-stone-300"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-medium text-xs">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900">{comment.author_name}</span>
                        {comment.author_role === 'admin' && (
                          <span className="text-[10px] text-[#1E3A8A] font-semibold ml-1.5 uppercase tracking-wider">
                            Editorial Staff
                          </span>
                        )}
                        <span className="text-stone-400 mx-1.5">·</span>
                        <time dateTime={comment.created_at} className="text-stone-400">
                          {commentDate}
                        </time>
                      </div>
                    </div>

                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded"
                        title="Delete this comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line pl-9">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Related Articles Strip */}
      {relatedPosts.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pt-12 border-t border-[#E7E3DC] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              Related Perspectives in {post.category}
            </h3>
            <Link to={`/blogs?category=${post.category}`} className="text-xs text-[#1E3A8A] font-semibold hover:underline">
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/blogs/${related.slug}`}
                className="group block bg-white border border-[#E7E3DC] rounded-xl p-5 hover:border-stone-300 transition-all space-y-2"
              >
                <span className="text-[11px] font-semibold text-[#1E3A8A]">{related.category}</span>
                <h4 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                  {related.title}
                </h4>
                <p className="text-stone-500 text-xs line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
