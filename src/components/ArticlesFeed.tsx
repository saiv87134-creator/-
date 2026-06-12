import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Search, Filter, Share2, Eye, Award, ExternalLink, Code, Languages, Sparkles } from 'lucide-react';
import { Article, AdSenseConfig } from '../types';

interface ArticlesFeedProps {
  articles: Article[];
  adsenseConfig: AdSenseConfig;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  isAdmin?: boolean;
}

export default function ArticlesFeed({ articles, adsenseConfig, onEditArticle, onDeleteArticle, isAdmin = false }: ArticlesFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);

  // Translation states
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translatedArticles, setTranslatedArticles] = useState<Record<string, { title: string; content: string; lang: 'ar' | 'en' }>>({});

  const handleTranslateArticle = async (article: Article, targetLang: 'ar' | 'en') => {
    const cacheKey = `${article.id}-${targetLang}`;
    if (translatedArticles[cacheKey]) {
      // Toggle back to original by removing from translated states
      const updated = { ...translatedArticles };
      delete updated[cacheKey];
      setTranslatedArticles(updated);
      return;
    }

    setTranslatingId(article.id);
    try {
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          targetLang
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      if (data.success) {
        setTranslatedArticles({
          ...translatedArticles,
          [cacheKey]: {
            title: data.translatedTitle,
            content: data.translatedContent,
            lang: targetLang
          }
        });
      }
    } catch (err) {
      console.error("[Translation error]", err);
    } finally {
      setTranslatingId(null);
    }
  };

  // Filtered articles based on search & category
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.searchDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['All Categories', ...Array.from(new Set(articles.map((art) => art.category)))];

  // Professional hand-crafted trending keywords list with high CPC values for global monetization
  const GLOBAL_TRENDS = [
    {
      topic: 'Edge Intelligence & Large Vision Models',
      country: 'United States 🇺🇸',
      volume: '140K searches/mo',
      cpc: '$18.40 CPC',
      category: 'Artificial Intelligence 🧠',
      vibe: 'High-intent software buyers'
    },
    {
      topic: 'Next-Gen Cyber Security & Host Intrusion Detection',
      country: 'United Kingdom 🇬🇧',
      volume: '95K searches/mo',
      cpc: '$14.20 CPC',
      category: 'Cyber Security 🔒',
      vibe: 'Enterprise security targets'
    },
    {
      topic: 'Optimal Placements and Mobile Layout Arbitrage',
      country: 'Saudi Arabia & UAE 🇸🇦🇦🇪',
      volume: '82K searches/mo',
      cpc: '$12.80 CPC',
      category: 'AdSense Strategy 📊',
      vibe: 'Premium publisher revenue'
    },
    {
      topic: 'Micro-Frontend Modular Systems & Vite Bundling',
      country: 'Canada & Germany 🇨🇦🇩🇪',
      volume: '110K searches/mo',
      cpc: '$11.50 CPC',
      category: 'Next-Gen Dev 💻',
      vibe: 'Active web engineers'
    }
  ];

  return (
    <div className="space-y-6" id="articles-feed-container">
      
      {/* GLOBAL TRENDS HIGH-CPC ACCELERATOR CARD */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/10 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#22C55E]">Live Global Trend Feed (Foreign Markets)</span>
            </div>
            <h2 className="text-white text-lg font-bold font-sans tracking-tight mt-1">
              High-CPC Search Trends to Target Worldwide 📈
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
              Write about these subjects to rank #1 on foreign Google search, attract premium western visitors, and maximize your Google AdSense income.
            </p>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl px-3 py-1.5 text-right font-sans">
            <span className="text-[10px] text-indigo-300 font-bold block">Estimated Impression Multiplier</span>
            <span className="text-sm font-extrabold text-white">4.8x US Traffic Yield 🚀</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GLOBAL_TRENDS.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#0b1528] rounded-xl p-4 border border-[#21324E]/50 flex flex-col justify-between space-y-4 hover:border-indigo-500/30 hover:shadow-lg transition duration-200"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-tight">{item.country}</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-extrabold px-1.5 py-0.5 rounded">
                    {item.cpc}
                  </span>
                </div>
                <h4 className="text-white text-xs font-bold leading-normal font-sans line-clamp-2 pt-1">{item.topic}</h4>
                <p className="text-[#8899A6] text-[10px]">{item.vibe}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#21324E]/40">
                <span className="text-[9px] text-[#A0AEC0] font-mono">{item.volume}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.topic);
                    setCopiedArticleId(`trend-${idx}`);
                    setTimeout(() => setCopiedArticleId(null), 2000);
                  }}
                  className="text-[9px] text-indigo-400 hover:text-white bg-indigo-505/10 hover:bg-indigo-600 py-1 px-2.5 rounded transition font-bold"
                >
                  {copiedArticleId === `trend-${idx}` ? 'Copied! ✓' : 'Copy Topic 📋'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#111C30] border border-[#21324E] p-4 rounded-xl">
        {/* Categories selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition duration-200 font-medium cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#18263D] text-slate-300 hover:bg-[#203250] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search bar input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, keywords, or content..."
            className="w-full bg-[#16253C] border border-[#2B3C58] rounded-xl px-4 py-2 pl-10 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Top Banner Advertisement simulated if enabled and set to top or all */}
      {adsenseConfig.enabled && (adsenseConfig.bannerPosition === 'top' || adsenseConfig.bannerPosition === 'all') && (
        <div className="bg-[#121E36] border border-amber-500/20 rounded-xl p-4 text-center relative overflow-hidden transition-all duration-300">
          <div className="absolute top-1 right-2 text-[9px] text-amber-500 font-mono flex items-center gap-1 font-bold">
            <Code className="w-3 h-3" />
            <span>Google AdSense Banner [ca-pub-{adsenseConfig.publisherId.substring(7, 13) || 'xxx'}]</span>
          </div>
          <div className="py-2 inline-flex flex-col items-center">
            <span className="text-[10px] uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold mb-1 tracking-wide">Sponsored Ad</span>
            <h4 className="text-white text-xs font-extrabold font-sans">Global Tech Advanced AI Boot Camp 🚀</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Join the highest high-CPC software engineering programs and claim up to 45% pricing credits today.</p>
          </div>
        </div>
      )}

      {/* Articles Feed list */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="bg-[#111C30] border border-dashed border-[#243550] rounded-xl py-12 text-center text-slate-400 text-sm space-y-2">
            <div className="text-2xl">📄</div>
            <p>No articles published yet under this category or search topic.</p>
            <p className="text-xs text-slate-500 text-indigo-400">Select the "Write Article" tab to draft and publish instantly!</p>
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <React.Fragment key={article.id}>
              {/* Actual News Post Card */}
              <div className="bg-[#111C30] border border-[#21324E] rounded-xl overflow-hidden shadow-lg transition duration-300 hover:border-[#384A6E] flex flex-col md:flex-row">
                
                {/* Visual Cover Side */}
                <div className="w-full md:w-1/3 min-h-[160px] md:min-h-full relative overflow-hidden bg-slate-900 group shrink-0">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#121F38] to-[#1D2F4E] text-slate-400 p-4">
                      <span>Image Placeholder</span>
                    </div>
                  )}
                  {/* Category badge layout */}
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                    {article.category}
                  </span>
                </div>

                {/* News Details Side styled visually LTR or RTL depending on translation state */}
                {(() => {
                  const isOriginalArabic = /[\u0600-\u06FF]/.test(article.title);
                  const targetLang = isOriginalArabic ? 'en' : 'ar';
                  const cacheKey = `${article.id}-${targetLang}`;
                  const translationDoc = translatedArticles[cacheKey];
                  const isTranslatedActive = !!translationDoc;

                  const displayedTitle = isTranslatedActive ? translationDoc.title : article.title;
                  const displayedContent = isTranslatedActive ? translationDoc.content : article.content;

                  return (
                    <div 
                      className={`w-full md:w-2/3 p-5 flex flex-col justify-between space-y-3 ${
                        isTranslatedActive && targetLang === 'ar' ? 'text-right font-sans' : 'text-left font-sans'
                      }`}
                      style={{ direction: isTranslatedActive && targetLang === 'ar' ? 'rtl' : 'ltr' }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <div className="flex items-center gap-2.5 font-semibold">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{article.publishedAt}</span>
                            </div>
                            
                            {/* Dynamic Translation Trigger */}
                            <button
                              onClick={() => handleTranslateArticle(article, targetLang)}
                              disabled={translatingId === article.id}
                              className={`flex items-center gap-1 px-2.5 py-0.5 border rounded-full transition font-sans font-bold cursor-pointer text-[9px] ${
                                isTranslatedActive
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                  : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/20 hover:text-white hover:bg-indigo-900/40'
                              }`}
                            >
                              {translatingId === article.id ? (
                                <>
                                  <span className="w-2 h-2 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                  <span>مترجم AI...</span>
                                </>
                              ) : isTranslatedActive ? (
                                <>
                                  <Languages className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>الأصل Original 🔄</span>
                                </>
                              ) : (
                                <>
                                  <Languages className="w-2.5 h-2.5" />
                                  <span>Translate to {isOriginalArabic ? 'English 🇺🇸' : 'Arabic 🇸🇦'}</span>
                                </>
                              )}
                            </button>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-3 font-semibold">
                              <button
                                onClick={() => onEditArticle(article)}
                                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteArticle(article.id)}
                                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <h3 className="text-white font-extrabold text-base leading-tight hover:text-indigo-300 cursor-pointer">
                          {displayedTitle}
                        </h3>

                        {/* Secondary Search meta description styled nicely in gray */}
                        {article.searchDescription && (
                          <p className={`bg-[#18263D]/40 text-[#A0AEC0] p-2 text-[11px] italic leading-relaxed ${
                            isTranslatedActive && targetLang === 'ar' ? 'border-r-2 border-indigo-500' : 'border-l-2 border-indigo-500'
                          }`}>
                            {article.searchDescription}
                          </p>
                        )}

                        <p className="text-slate-300 text-xs leading-relaxed line-clamp-4 whitespace-pre-wrap">
                          {displayedContent}
                        </p>
                      </div>

                      <div className="border-t border-[#21324E] pt-3 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <div className="flex items-center gap-3">
                      <span>By: Editorial Staff</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3.5 h-3.5" />
                        {845 + (index * 13)} Reads
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="relative">
                        <button
                          onClick={() => setActiveShareId(activeShareId === article.id ? null : article.id)}
                          className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                            activeShareId === article.id 
                              ? 'bg-indigo-600 text-white' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                          title="Share Article"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Share</span>
                        </button>

                        {activeShareId === article.id && (
                          <>
                            {/* Backdrop to dismiss share modal */}
                            <div 
                              className="fixed inset-0 z-40 bg-transparent" 
                              onClick={() => setActiveShareId(null)}
                            />
                            <div className="absolute right-0 bottom-full mb-2 w-52 bg-[#14233C] border border-[#233B5E] rounded-xl shadow-xl py-1.5 px-1 z-50 font-sans text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                              <span className="block text-[9px] text-slate-500 px-2.5 py-1 font-bold uppercase tracking-wider">Share Article</span>
                              
                              {/* Copy Link button */}
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/article/${article.id}`;
                                  navigator.clipboard.writeText(url);
                                  setCopiedArticleId(article.id);
                                  setTimeout(() => setCopiedArticleId(null), 2000);
                                }}
                                className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-[#1C2F4D] text-slate-200 flex items-center justify-between transition cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">🔗</span>
                                  <span className="font-semibold text-slate-300">Copy Fast Link</span>
                                </div>
                                {copiedArticleId === article.id && (
                                  <span className="text-emerald-400 font-bold text-[9px] bg-emerald-500/10 py-0.5 px-2 rounded-full border border-emerald-500/20 font-mono animate-bounce">Copied!</span>
                                )}
                              </button>

                              {/* WhatsApp Share */}
                              <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + `${window.location.origin}/article/${article.id}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveShareId(null)}
                                className="px-2.5 py-2.5 rounded-lg hover:bg-[#1C2F4D] text-slate-200 flex items-center gap-2 transition block hover:text-emerald-400"
                              >
                                <span className="text-sm">💬</span>
                                <span className="font-semibold">WhatsApp Chat</span>
                              </a>

                              {/* X / Twitter Share */}
                              <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/article/${article.id}`)}&text=${encodeURIComponent(article.title)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveShareId(null)}
                                className="px-2.5 py-2.5 rounded-lg hover:bg-[#1C2F4D] text-slate-200 flex items-center gap-2 transition block hover:text-indigo-400"
                              >
                                <span className="text-sm">𝕏</span>
                                <span className="font-semibold">Twitter / X Post</span>
                              </a>

                              {/* Facebook Share */}
                              <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/article/${article.id}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveShareId(null)}
                                className="px-2.5 py-2.5 rounded-lg hover:bg-[#1C2F4D] text-slate-200 flex items-center gap-2 transition block hover:text-blue-400"
                              >
                                <span className="text-sm">👥</span>
                                <span className="font-semibold">Facebook Feed</span>
                              </a>

                              {/* Telegram Share */}
                              <a
                                href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/article/${article.id}`)}&text=${encodeURIComponent(article.title)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveShareId(null)}
                                className="px-2.5 py-2.5 rounded-lg hover:bg-[#1C2F4D] text-slate-200 flex items-center gap-2 transition block hover:text-sky-400"
                              >
                                <span className="text-sm">✈️</span>
                                <span className="font-semibold">Telegram Channel</span>
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

              </div>

              {/* Interleaved AdSense Banner simulated after every second article if enabled and set to feed or all */}
              {adsenseConfig.enabled && (adsenseConfig.bannerPosition === 'between_articles' || adsenseConfig.bannerPosition === 'all') && (index + 1) % 2 === 0 && (
                <div className="bg-[#121E36] border border-amber-500/20 rounded-xl p-4 text-center relative overflow-hidden transition-all duration-300 animate-feed-enter">
                  <div className="absolute top-1 right-2 text-[9px] text-amber-500 font-mono flex items-center gap-1 font-bold">
                    <Code className="w-3 h-3" />
                    <span>Google AdSense [Slot-{adsenseConfig.adSlotId || 'xxxxxx'}]</span>
                  </div>
                  <div className="py-2 inline-flex flex-col items-center">
                    <span className="text-[10px] uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold mb-1 tracking-wide">Sponsored Recommendation</span>
                    <h4 className="text-white text-xs font-extrabold font-sans">Premium SEO Auditing & High CPC AdSense Certification Programs 📈</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Skyrocket organic traffic from Tier-1 countries with Globe Chronicle premium consultancy partners.</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Sidebar/Floating advertisement mock at the end of feed */}
      {adsenseConfig.enabled && (adsenseConfig.bannerPosition === 'sidebar' || adsenseConfig.bannerPosition === 'all') && (
        <div className="mt-8 bg-[#0F1929] border border-dashed border-[#23354E] rounded-xl p-5 text-center font-sans">
          <div className="flex items-center justify-between text-[9px] text-slate-500 mb-2">
            <span className="bg-amber-500/10 text-amber-400 py-0.5 px-1.5 rounded block text-[9px]">Google AdSense</span>
            <span>Promotional Partner</span>
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-xs">Unlock Customized Monetization and Layout Audits</h5>
            <p className="text-slate-400 text-[10px]">High-performance technical consultations, indexing support, and responsive code implementation templates.</p>
            <div className="text-[9px] text-slate-500 font-mono">SlotID: {adsenseConfig.adSlotId || 'default'} | Publisher: {adsenseConfig.publisherId || 'default'}</div>
            <a href="#" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1 px-3 rounded inline-block transition mt-1">
              Contact Consulting ⚡
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
