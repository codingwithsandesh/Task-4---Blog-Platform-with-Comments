import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <span className="font-mono text-sm text-stone-400 font-semibold tracking-widest uppercase">
        Error 404 · Archival Miss
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
        The manuscript or route you are looking for has either been relocated, retracted, or does not exist in our editorial catalog.
      </p>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Explore Articles</span>
        </Link>
      </div>
    </div>
  );
};
