import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, HelpCircle, FileText, Search, Settings, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface SEOLabProps {
  articles: Article[];
  currentPendingArticle?: {
    title: string;
    content: string;
    searchDescription: string;
  };
}

export default function SEOLab({ articles, currentPendingArticle }: SEOLabProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>('pending');
  const [targetKeyword, setTargetKeyword] = useState<string>('');

  // Get active article
  const getActiveArticle = () => {
    if (selectedArticleId === 'pending' && currentPendingArticle) {
      return {
        title: currentPendingArticle.title || 'Unsaved Workspace Draft',
        content: currentPendingArticle.content || '',
        searchDescription: currentPendingArticle.searchDescription || '',
      };
    }
    const found = articles.find(a => a.id === selectedArticleId);
    if (found) return found;
    return {
      title: 'Choose a post story to analyze...',
      content: '',
      searchDescription: '',
    };
  };

  const active = getActiveArticle();

  // Run a real lightweight SEO analyze calculation
  const analyzeSEO = () => {
    const title = active.title;
    const content = active.content;
    const desc = active.searchDescription;

    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const charCount = content ? content.length : 0;
    const descCount = desc ? desc.length : 0;

    let score = 30; // base score if text exists
    const checks: { title: string; status: 'v' | 'w' | 'x'; info: string }[] = [];

    // Title score checks
    if (!title || title.trim() === 'Choose a post story to analyze...' || title.trim() === 'Unsaved Workspace Draft' || title.length < 5) {
      checks.push({ title: 'SEO Title Length', status: 'x', info: 'Draft headline is empty or too short is secure google indexes.' });
    } else if (title.length > 45) {
      checks.push({ title: 'SEO Title Length', status: 'v', info: `Excellent headline depth (${title.length} chars). Meets standard search display limits.` });
      score += 20;
    } else {
      checks.push({ title: 'SEO Title Length', status: 'w', info: 'Consider lengthening to 45-60 structures to increase audience click rates.' });
      score += 10;
    }

    // Keyword checking
    if (targetKeyword) {
      const regex = new RegExp(targetKeyword, 'gi');
      const matches = content ? (content.match(regex) || []).length : 0;
      const density = wordCount > 0 ? (matches / wordCount) * 100 : 0;

      if (matches === 0) {
        checks.push({ title: 'Target SEO Keyword Focus', status: 'x', info: `Could not find keyword matches for "${targetKeyword}" in your story body.` });
      } else if (density >= 0.5 && density <= 2.5) {
        checks.push({ title: 'Target SEO Keyword Focus', status: 'v', info: `Optimal keyword density (${density.toFixed(2)}%), repeated ${matches} times.` });
        score += 25;
      } else {
        checks.push({ title: 'Target SEO Keyword Focus', status: 'w', info: `Keyword exists but density is unbalanced (${density.toFixed(2)}%). Target 1% to 2% to prevent spam tags.` });
        score += 15;
      }
    } else {
      checks.push({ title: 'Target SEO Keyword Focus', status: 'w', info: 'Define a focus keyword to trace occurrences and structural layouts.' });
    }

    // Search Description check (against 160 characters ceiling)
    if (!desc) {
      checks.push({ title: 'Meta Description Tag', status: 'x', info: 'Missing Search description. Google will default to generic page clippings.' });
    } else if (descCount > 100 && descCount <= 160) {
      checks.push({ title: 'Meta Description Tag', status: 'v', info: `Perfect metadata depth (${descCount} chars). Fully matches recommended 160 chars cap.` });
      score += 25;
    } else {
      checks.push({ title: 'Meta Description Tag', status: 'w', info: `Length is ${descCount} chars. Ideal length to prevent truncation is between 100 and 160 chars.` });
      score += 15;
    }

    // Content length check
    if (wordCount === 0) {
      checks.push({ title: 'Article Word Volume', status: 'x', info: 'Write some content structures first inside active draft editor.' });
    } else if (wordCount > 300) {
      checks.push({ title: 'Article Word Volume', status: 'v', info: `Outstanding article length (${wordCount} words). Heavily prioritized by standard search bots.` });
      score += 20;
    } else {
      checks.push({ title: 'Article Word Volume', status: 'w', info: `Relatively thin content (${wordCount} words). Expand explanations to satisfy reader queries.` });
      score += 10;
    }

    return {
      score: Math.min(100, score),
      checks,
      wordCount,
      charCount
    };
  };

  const results = analyzeSEO();

  return (
    <div className="space-y-6" id="seo-lab-container">
      {/* Selector and Target Keyword row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111C30] border border-[#21324E] p-4 rounded-xl">
        {/* Selected Document dropdown */}
        <div className="space-y-1.5 text-left font-sans">
          <label className="text-white text-xs font-semibold block">Select Target Article to Inspect:</label>
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="w-full bg-[#18263E] border border-[#2B3C58] rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            {currentPendingArticle && (
              <option value="pending">Active Writer Workspace Draft</option>
            )}
            {articles.map(art => (
              <option key={art.id} value={art.id}>{art.title.substring(0, 45)}...</option>
            ))}
          </select>
        </div>

        {/* Target Keyword input */}
        <div className="space-y-1.5 text-left font-sans">
          <label className="text-white text-xs font-semibold block">Focus Search Keyword (Query Match):</label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            placeholder="e.g., machine learning, clean code, cloud solutions..."
            className="w-full bg-[#18263E] border border-[#2B3C58] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Main Analysis Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommendation Score panel */}
        <div className="lg:col-span-8 bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-4">
          <h3 className="text-white font-bold text-sm text-left border-b border-[#21324E] pb-3">
            SEO Compliance Metrics & Verification Reports
          </h3>

          <div className="space-y-3.5">
            {results.checks.map((ck, i) => (
              <div key={i} className="flex items-start justify-between bg-[#14233C] p-3 rounded-lg border border-[#223654] gap-3">
                <div className="text-left font-sans">
                  <span className="text-[10px] text-slate-400 font-semibold block">{ck.title}</span>
                  <span className="text-white text-xs font-medium block mt-0.5">{ck.info}</span>
                </div>
                <div className="shrink-0">
                  {ck.status === 'v' && (
                    <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 py-1 px-2.5 rounded-full border border-emerald-500/20 font-sans">Passed ✓</span>
                  )}
                  {ck.status === 'w' && (
                    <span className="text-amber-400 text-[10px] font-bold bg-amber-500/10 py-1 px-2.5 rounded-full border border-amber-500/20 font-sans">Warning</span>
                  )}
                  {ck.status === 'x' && (
                    <span className="text-rose-400 text-[10px] font-bold bg-rose-500/10 py-1 px-2.5 rounded-full border border-rose-500/20 font-sans">Missing</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Progress score card */}
        <div className="lg:col-span-4 bg-[#111C30] border border-[#21324E] rounded-xl p-5 flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full">
            <h4 className="text-white font-bold text-xs text-left">Unified SEO Rank Rating</h4>
            <div className="border-b border-[#1E2D44] my-2"></div>
          </div>

          <div className="relative inline-flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-32 h-32">
              <circle
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
              />
              <circle
                className="text-indigo-500 transition-all duration-500"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - results.score / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="52"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-white text-3xl font-extrabold font-mono">{results.score}</span>
              <span className="text-indigo-300 text-[10px] block font-semibold">%</span>
            </div>
          </div>

          <div className="space-y-1 font-sans">
            <p className="text-white font-bold text-xs">
              {results.score >= 80 ? 'Ready for Instant Google Ranks! 🎉' : results.score >= 50 ? 'Requires Improvements ⚠️' : 'Poorly Optimized Content ⚠️'}
            </p>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              Optimizing these diagnostic variables raises target keyword priorities on global indexing spiders instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full text-[10px] text-slate-400 font-mono bg-[#18263D] p-2 rounded-lg">
            <div>
              <span className="block text-slate-500 font-sans">Characters:</span>
              <span className="text-white font-bold">{results.charCount}</span>
            </div>
            <div className="border-l border-slate-700">
              <span className="block text-slate-500 font-sans">Words:</span>
              <span className="text-white font-bold">{results.wordCount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
