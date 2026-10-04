import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Save,
  Send,
  Eye,
  FileEdit,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = ['Engineering', 'Design', 'Culture', 'Philosophy', 'Technology', 'General'];

const SAMPLE_COVERS = [
  { label: 'Bengaluru Tech Pavilion', url: '/src/assets/images/india_bangalore_tech_1791102059470.jpg' },
  { label: 'Ahmedabad Jali Studio', url: '/src/assets/images/india_ahmedabad_studio_1791102080383.jpg' },
  { label: 'Indic Script Letterpress', url: '/src/assets/images/india_letterpress_indic_1791102092824.jpg' },
  { label: 'Mysore Teak Desk', url: '/src/assets/images/india_minimalist_desk_1791102112270.jpg' },
];

export const CreateBlog: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [tags, setTags] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setErrorMessage(null);

    if (title.trim().length < 5) {
      setErrorMessage('Title must be at least 5 characters long.');
      return;
    }
    if (excerpt.trim().length < 10) {
      setErrorMessage('Excerpt must be at least 10 characters long.');
      return;
    }
    if (content.trim().length < 20) {
      setErrorMessage('Article content must be at least 20 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createPost({
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image_url: coverUrl.trim() || null,
        category,
        tags: tags.trim() || null,
        status,
      });

      if (res.data) {
        showToast(
          status === 'published' ? 'Article published successfully!' : 'Draft saved successfully!',
          'success'
        );
        if (status === 'published') {
          navigate(`/blogs/${res.data.slug}`);
        } else {
          navigate('/my-blogs');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save article.');
      showToast('Could not save post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Bar with actions */}
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
          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs mr-2">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'edit' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Compose</span>
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
            disabled={submitting}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5 text-stone-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-40 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Editor Body vs Preview */}
      {activeTab === 'edit' ? (
        <div className="space-y-6">
          
          {/* Title */}
          <div className="space-y-1.5">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article Title..."
              className="w-full bg-transparent font-serif text-3xl sm:text-4xl font-semibold text-stone-900 placeholder:text-stone-300 focus:outline-none"
            />
          </div>

          {/* Slug & Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200/80">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                URL Slug
              </label>
              <div className="flex items-center text-xs text-stone-500 font-mono bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                <span>/blogs/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManual(true);
                  }}
                  placeholder="custom-slug"
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
              Short Excerpt / Deck (Summarizes the essay)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise, compelling overview of your arguments or findings..."
              rows={2}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
            />
          </div>

          {/* Cover Image URL with quick presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Cover Image URL (Optional)
              </label>
              <span className="text-[11px] text-stone-400">Click a preset or enter URL</span>
            </div>
            
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://... or choose a preset below"
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#1E3A8A]" />
                Presets:
              </span>
              {SAMPLE_COVERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverUrl(preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    coverUrl === preset.url
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Architecture, Systems, Performance"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
            />
          </div>

          {/* Article Content */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Article Body (Markdown supported: ## Headings, &gt; Quotes, 1. Lists)
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin writing your narrative or technical essay here. Use blank lines between paragraphs..."
              rows={16}
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl font-sans text-sm sm:text-base leading-relaxed text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] resize-y"
            />
          </div>

        </div>
      ) : (
        /* Live Preview Mode */
        <article className="space-y-6 bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="space-y-3 border-b border-[#E7E3DC] pb-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span className="text-[#1E3A8A] font-semibold">{category}</span>
              <span aria-hidden="true">·</span>
              <span>Draft Preview</span>
              <span aria-hidden="true">·</span>
              <span>Author: {user?.name || 'You'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 leading-tight">
              {title || 'Untitled Article'}
            </h1>
            {excerpt && (
              <p className="font-serif italic text-base sm:text-lg text-stone-600 leading-relaxed">
                {excerpt}
              </p>
            )}
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
            {content ? (
              content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? 'drop-cap' : ''}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-stone-400 italic">No content written yet.</p>
            )}
          </div>
        </article>
      )}

    </div>
  );
};
