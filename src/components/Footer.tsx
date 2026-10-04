import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Database, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<{ isUsingMySQL: boolean; engine: string } | null>(null);

  useEffect(() => {
    api.getHealth()
      .then((res) => {
        if (res.data?.database) {
          setDbInfo(res.data.database);
        }
      })
      .catch(() => {
        // quiet fallback
      });
  }, []);

  return (
    <footer className="border-t border-[#E7E3DC] bg-[#FAF8F5] pt-14 pb-12 mt-20 text-stone-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                BlogSphere
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#1E3A8A]">
                · Bharat Edition
              </span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed max-w-md font-serif italic">
              Ideas Worth Sharing. Stories That Connect.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed max-w-md">
              India's premier independent publishing platform for systems architects, Indic typographers, software engineers, and contemplative writers. Crafted with pride across Bengaluru, Pune, and New Delhi.
            </p>
            
            {/* System Engine indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
              <Database className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Data Layer: {dbInfo?.isUsingMySQL ? 'MySQL 8.0 (Asia-South)' : 'Persistent Relational Disk Store'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3 h-3" />
                REST API Online (IST)
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-stone-900 transition-colors">Home Edition</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-stone-900 transition-colors">Explore All Articles</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-stone-900 transition-colors">Editorial Manifesto</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-stone-900 transition-colors">Inquiries & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Editorial Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Editorial Topics
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blogs?category=Engineering" className="hover:text-stone-900 transition-colors">Engineering & Architecture</Link>
              </li>
              <li>
                <Link to="/blogs?category=Technology" className="hover:text-stone-900 transition-colors">Distributed Technology</Link>
              </li>
              <li>
                <Link to="/blogs?category=Design" className="hover:text-stone-900 transition-colors">Typography & Design Systems</Link>
              </li>
              <li>
                <Link to="/blogs?category=Philosophy" className="hover:text-stone-900 transition-colors">Craftsmanship & Focus</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom hairline & copyright */}
        <div className="border-t border-[#E7E3DC] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <p>© {new Date().getFullYear()} BlogSphere Publishing Platform · Engineered with pride in India (भारत)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Bengaluru · Pune · New Delhi · Hyderabad</span>
            <span aria-hidden="true">·</span>
            <span>MySQL 8.0 & Express REST API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
