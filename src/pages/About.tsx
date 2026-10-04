import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Compass, ShieldCheck, Feather } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      
      {/* Title */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
          <Feather className="w-3.5 h-3.5" />
          <span>The BlogSphere Bharat Manifesto</span>
        </div>
        <h1 
          className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-stone-900 leading-tight"
          style={{ textWrap: 'balance' }}
        >
          Ideas Worth Sharing. Stories That Connect.
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-stone-600 leading-relaxed">
          Rooted in India's timeless intellectual tradition of rigorous debate, architectural wisdom, and world-class digital craftsmanship.
        </p>
      </section>

      {/* Editorial Narrative */}
      <section className="bg-white border border-[#E7E3DC] rounded-2xl p-8 sm:p-12 space-y-6 text-stone-800 text-base sm:text-lg leading-relaxed shadow-xs">
        <p className="drop-cap">
          India stands at a historic cultural and technological intersection. From the bustling engineering corridors of Bengaluru and Pune to the quiet architectural studios of Ahmedabad and Shantiniketan, a new generation of builders is synthesizing centuries of philosophical inquiry with cutting-edge distributed computing.
        </p>

        <p>
          In our ancient intellectual tradition, knowledge was never passive; it evolved through <em>vada</em> and <em>tarka</em>—reasoned, respectful debate where ideas were tested and honed. BlogSphere brings this sacred ethos into the digital century. We reject algorithmic clickbait and disposable hot-takes in favor of long-form clarity and lasting insight.
        </p>

        <blockquote className="border-l-2 border-[#1E3A8A] pl-5 italic text-stone-700 my-6 font-serif text-xl">
          "True innovation does not borrow indiscriminately from foreign templates; it builds upon the deep foundations of its own soil and context."
        </blockquote>

        <p>
          Whether dissecting the zero-trust cryptography of the India Stack, examining passive thermal cooling in Chettinad architecture, or refining typography for Indic scripts across 22 constitutional languages, BlogSphere is where India’s most thoughtful builders write.
        </p>
      </section>

      {/* Four Pillars */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Our Editorial Principles
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            The values that guide every feature we architect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 space-y-3">
            <BookOpen className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              01. Deliberate Craftsmanship
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              We favor slow, well-considered writing over reactive noise. Software and essays constructed with intentional care endure for years.
            </p>
          </div>

          <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 space-y-3">
            <Compass className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              02. Thoughtful Discourse
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              The comments section is not an afterthought. It is a peer review and intellectual dialogue where reader contributions enrich the original text.
            </p>
          </div>

          <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 space-y-3">
            <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              03. Authentic Authorship
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Every author has complete control over their drafts, published articles, and audience interactions without algorithmic gatekeeping.
            </p>
          </div>

          <div className="bg-white border border-[#E7E3DC] rounded-xl p-6 space-y-3">
            <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              04. Typographic Cadence
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Reading online should be as comfortable as reading archival fine paper. Warm neutrals, clear type hierarchies, and zero distracting popups.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center pt-8 border-t border-[#E7E3DC] space-y-4">
        <h3 className="font-serif text-2xl font-semibold text-stone-900">
          Ready to contribute your voice?
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Start publishing essays or explore articles written by engineers and researchers worldwide.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            <span>Create Author Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
          >
            <span>Browse All Articles</span>
          </Link>
        </div>
      </section>

    </div>
  );
};
