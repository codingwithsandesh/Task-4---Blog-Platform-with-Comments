import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Save,
  Send,
  Eye,
  FileEdit,
  ArrowLeft,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Post } from '../types';

const CATEGORIES = ['Engineering', 'Design', 'Culture', 'Philosophy', 'Technology', 'General'];

export const EditBlog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (articleSlug: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getPostBySlug(articleSlug);
      if (res.data) {
        const p = res.data;
        // Verify ownership
        if (user && p.author_id !== user.id && user.role !== 'admin') {
          setErrorMessage('You do not have permission to edit this article.');
          return;
        }

        setPost(p);
        setTitle(p.title);
        setPostSlug(p.slug);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setCoverUrl(p.cover_image_url || '');
        setCategory(p.category);
        setTags(p.tags || '');
        setStatus(p.status);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (targetStatus?: 'draft' | 'published') => {
    if (!post) return;
    setErrorMessage(null);

    const chosenStatus = targetStatus || status;

    if (title.trim().length < 5) {
      setErrorMessage('Title must be at least 5 characters long.');
      return;
    }
    if (excerpt.trim().length < 10) {
      setErrorMessage('Excerpt must be at least 10 characters long.');
      return;
    }
    if (content.trim().length < 20) {
      setErrorMessage('Content must be at least 20 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.updatePost(post.id, {
        title: title.trim(),
        slug: postSlug.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image_url: coverUrl.trim() || null,
        category,
        tags: tags.trim() || null,
        status: chosenStatus,
      });

      if (res.data) {
        showToast('Article updated successfully!', 'success');
        navigate(`/blogs/${res.data.slug}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update article.');
      showToast('Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm('Are you sure you want to permanently delete this article and its comments? This cannot be undone.')) {
      return;
    }

    try {
      await api.deletePost(post.id);
      showToast('Article deleted successfully', 'info');
      navigate('/my-blogs');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete article', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-stone-200 rounded" />
        <div className="h-12 w-full bg-stone-200 rounded-lg" />
        <div className="h-40 w-full bg-stone-200 rounded-xl" />
      </div>
    );
  }

  if (errorMessage && !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="font-serif text-2xl font-semibold text-stone-900">Access Denied</h1>
        <p className="text-stone-600 text-sm">{errorMessage}</p>
        <button
          onClick={() => navigate('/my-blogs')}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800"
        >
          Return to My Articles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E3DC] pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs mr-2">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'edit' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg border border-stone-200"
            title="Delete this article"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('draft')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5 text-stone-500" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('published')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-40 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Saving...' : 'Update & Publish'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {activeTab === 'edit' ? (
        <div className="space-y-6">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent font-serif text-3xl sm:text-4xl font-semibold text-stone-900 focus:outline-none"
            />
          </div>

          {/* Slug and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200/80">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Slug (URL Path)
              </label>
              <div className="flex items-center text-xs text-stone-500 font-mono bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                <span>/blogs/</span>
                <input
                  type="text"
                  value={postSlug}
                  onChange={(e) => setPostSlug(e.target.value)}
                  className="bg-transparent text-stone-800 focus:outline-none flex-1 ml-1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Short Excerpt / Deck
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
            />
          </div>

          {/* Cover image */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Cover Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Article Body
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl font-sans text-sm sm:text-base leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 resize-y"
            />
          </div>

        </div>
      ) : (
        /* Preview */
        <article className="space-y-6 bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="space-y-3 border-b border-[#E7E3DC] pb-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span className="text-[#1E3A8A] font-semibold">{category}</span>
              <span aria-hidden="true">·</span>
              <span>Editing Preview</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 leading-tight">
              {title}
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-stone-600 leading-relaxed">
              {excerpt}
            </p>
          </div>

          {coverUrl && (
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-100">
              <img
                src={coverUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="font-sans text-stone-800 text-base leading-relaxed space-y-4">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? 'drop-cap' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      )}

    </div>
  );
};
