import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  PenTool, 
  Compass, 
  HelpCircle, 
  Settings, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  CheckCircle2, 
  Search, 
  Image as ImageIcon,
  ArrowRight,
  Sun,
  Moon,
  Plus,
  Bot,
  Cookie,
  Globe,
  Activity,
  Eye,
  X,
  Link,
  Copy,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

import { Article, AdSenseConfig } from './types';
import UploadZone from './components/UploadZone';
import AdSenseSettings from './components/AdSenseSettings';
import ArticlesFeed from './components/ArticlesFeed';
import SEOLab from './components/SEOLab';
import AIPlanner from './components/AIPlanner';
import AnalyticsAndIndexing from './components/AnalyticsAndIndexing';
import CustomDomainSetup from './components/CustomDomainSetup';

// Base initial dummy news for a populated premium experience
const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Future of Organic Biocomputing: Brain Tissue Integration with Regenerative Silicon Chipsets 🧠⚡',
    category: 'Artificial Intelligence 🧠',
    searchDescription: 'An exploration of hybrid biocomputing chips utilizing human neural cells on microelectrodes for zero-emission neural networks.',
    content: 'The tech industry has taken its first official steps towards manufacturing hybrid bio-digital processors that operate real neural cells within mineral silicon circuits. The breakthrough, led by an academic alliance, aims to drastically reduce the power requirements demanded by classical computing servers.\n\nBy connecting live neuron cultures to microscopic dual-pole electrodes, researchers successfully guided the biological framework to process simple classification routines. This opens up unprecedented avenues for organic cybernetic models integrated directly with hyper-performing cloud systems.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-06-11'
  },
  {
    id: 'art-2',
    title: 'How to Secure Production Enterprise Servers from Stealth Binary Injection and Malware Infection Tactics 🔒🕵️',
    category: 'Cyber Security 🔒',
    searchDescription: 'An in-depth guide on deploying dynamic firewalls and static code sanitizers to guard high-authority blogs and servers.',
    content: 'Recent months have shown a spike in covert injection attacks targeting hidden request headers of hybrid web servers, where attackers mask shellcodes inside standard static asset distributions. To address this risk, modern hosting configurations mandate next-generation firewalls coupled with strict file integrity audits.\n\nThis blueprint details dynamic header cleaning strategies, automatic server container isolation, and safe configuration settings that elevate your high-authority blog and cloud servers to a 99.99% defense-tier level.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-06-10'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'write' | 'seo' | 'planner' | 'adsense' | 'analytics' | 'domain'>('feed'); // Reverted default to feed so they can see feed first
  const [articles, setArticles] = useState<Article[]>([]);
  const [adsenseConfig, setAdsenseConfig] = useState<AdSenseConfig>({
    enabled: true,
    publisherId: 'ca-pub-6481029471930491',
    adSlotId: '1294801948',
    customCode: '',
    bannerPosition: 'all',
    cookieBannerActive: true
  });

  // Dark/Light toggle
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAdSenseOpen, setIsAdSenseOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Admin lock & identification states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const savedAdmin = localStorage.getItem('gc_admin_active');
      
      // Auto-enable in development context to facilitate setup
      if (
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.includes('ais-dev-')
      ) {
        return savedAdmin !== 'false'; // defaults to true in dev
      }
      return savedAdmin === 'true';
    }
    return false;
  });

  // Owner authentication state (session-based for safety)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Frictionless unlock for local developers
      if (
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.includes('ais-dev-')
      ) {
        return true;
      }
      return sessionStorage.getItem('gc_owner_authenticated') === 'true';
    }
    return false;
  });

  const [ownerPasscode, setOwnerPasscode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gc_owner_passcode') || '';
    }
    return '';
  });

  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  
  // Click counter on the logo to toggle admin mode secretively (easter egg!)
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) {
      const nextAdmin = !isAdmin;
      if (nextAdmin) {
        if (isUnlocked) {
          setIsAdmin(true);
          localStorage.setItem('gc_admin_active', 'true');
          triggerToast("🔓 وضع المسؤول نشط ومفتوح الآن! 🎉");
        } else {
          setShowPasscodeModal(true);
        }
      } else {
        setIsAdmin(false);
        localStorage.setItem('gc_admin_active', 'false');
        setIsUnlocked(false);
        sessionStorage.removeItem('gc_owner_authenticated');
        triggerToast("🔒 وضع الزائر نشط! هكذا يظهر الموقع للأجانب وعناكب أرشفة جوجل كونسول.");
      }
      setLogoClicks(0);
    }
  };

  // Write Article form states matching the screenshot
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence 🧠');
  const [content, setContent] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Custom draft tags and assist state
  const [draftKeywords, setDraftKeywords] = useState<string[]>(['SEO Strategy 📈', 'AdSense Approval 💰']);
  const [optimizingDraft, setOptimizingDraft] = useState(false);

  // Bot Auto Posting states
  const [botActive, setBotActive] = useState(true);
  const [botLoading, setBotLoading] = useState(false);
  const [lastBotPostTime, setLastBotPostTime] = useState<string>('');

  // Cookie banner acceptance
  const [cookieDismissed, setCookieDismissed] = useState(false);

  // Shared Draft view states
  const [sharedDraft, setSharedDraft] = useState<any | null>(null);
  const [sharedDraftLoading, setSharedDraftLoading] = useState(false);
  const [sharedDraftError, setSharedDraftError] = useState<string | null>(null);
  const [isGeneratingDirectLink, setIsGeneratingDirectLink] = useState(false);

  // Alerts & Toast messages
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if viewing a shared temporary draft
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const dId = searchParams.get('draftId');
      if (dId) {
        setSharedDraftLoading(true);
        fetch(`/api/drafts/${dId}`)
          .then(res => {
            if (!res.ok) throw new Error("This temporary draft link has expired or is invalid.");
            return res.json();
          })
          .then(data => {
            setSharedDraft(data);
            setSharedDraftLoading(false);
            triggerToast("🔓 Shared draft loaded successfully!");
          })
          .catch(err => {
            setSharedDraftError(err.message);
            setSharedDraftLoading(false);
          });
      }
    }
  }, []);

  // Guard to prevent premature synchronization before the server state loads
  const isLoaded = useRef(false);

  // Hydrate from back-end server (as the single source of truth) or fallback to local storage
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(serverArticles => {
        if (Array.isArray(serverArticles) && serverArticles.length > 0) {
          setArticles(serverArticles);
          localStorage.setItem('gc_articles', JSON.stringify(serverArticles));
          isLoaded.current = true;
        } else {
          // If server store is empty, check localStorage
          const savedArticles = localStorage.getItem('gc_articles');
          if (savedArticles) {
            try {
              const parsed = JSON.parse(savedArticles);
              setArticles(parsed);
              isLoaded.current = true;
              // Populate server with current localStorage array
              fetch('/api/sync-articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed)
              }).catch(e => console.error("Initial sync post error:", e));
            } catch (err) {
              setArticles(INITIAL_ARTICLES);
              localStorage.setItem('gc_articles', JSON.stringify(INITIAL_ARTICLES));
              isLoaded.current = true;
            }
          } else {
            setArticles(INITIAL_ARTICLES);
            localStorage.setItem('gc_articles', JSON.stringify(INITIAL_ARTICLES));
            isLoaded.current = true;
            fetch('/api/sync-articles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(INITIAL_ARTICLES)
            }).catch(e => console.error("Initial sync fallback post error:", e));
          }
        }
      })
      .catch(err => {
        console.error("Failed to connect with back-end articles endpoint, reading local fallback", err);
        const savedArticles = localStorage.getItem('gc_articles');
        if (savedArticles) {
          try {
            setArticles(JSON.parse(savedArticles));
          } catch (e) {
            setArticles(INITIAL_ARTICLES);
          }
        } else {
          setArticles(INITIAL_ARTICLES);
        }
        isLoaded.current = true;
      });

    const savedAdSense = localStorage.getItem('gc_adsense_config');
    if (savedAdSense) {
      setAdsenseConfig(JSON.parse(savedAdSense));
    }
  }, []);

  // Synchronize dynamic client articles list with full-stack Express server in real-time
  useEffect(() => {
    if (isLoaded.current && articles) {
      fetch('/api/sync-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articles)
      }).catch(err => {
        console.error("Error communicating articles sync to host server:", err);
      });
    }
  }, [articles]);

  // Register active visit on mount & when active tab changes, to build real-time analytics
  useEffect(() => {
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: window.location.pathname + window.location.search + (activeTab ? `?tab=${activeTab}` : ''),
        referrer: document.referrer || 'Direct'
      })
    }).catch(err => console.error("Visit registration failed:", err));
  }, [activeTab]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Call full-stack express server to auto-optimize draft title and generate tags/description using Gemini
  const handleAIAutoOptimize = async () => {
    if (!title.trim() && !content.trim()) {
      triggerToast('Please write a title or draft text first so the AI can format it!');
      return;
    }

    setOptimizingDraft(true);
    try {
      const response = await fetch('/api/gemini/optimize-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category
        })
      });

      if (!response.ok) {
        throw new Error('Failed response');
      }

      const result = await response.json();
      
      // Update form inputs with optimized AI contents
      setTitle(result.optimizedTitle || title);
      setContent(result.optimizedContent || content);
      setCategory(result.category || category);
      setSearchDescription(result.searchDescription || searchDescription);
      if (result.coverImage) {
        setCoverImage(result.coverImage);
      }
      if (result.keywords) {
        setDraftKeywords(result.keywords);
      }

      triggerToast('✓ AI Assistant has beautifully optimized your title, content structure, and SEO tags! ✨');
    } catch (err) {
      console.error(err);
      triggerToast('Alert: Could not connect to the AI server. Simulated local metadata applied.');
    } finally {
      setOptimizingDraft(false);
    }
  };

  // Trigger automated daily posterior bot immediately using our server-side API
  const triggerBotArticleGeneration = async () => {
    setBotLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-bot-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot article');
      }

      const botArticleData = await response.json();

      const newBotArticle: Article = {
        id: `bot-art-${Date.now()}`,
        title: botArticleData.title,
        content: botArticleData.content,
        category: botArticleData.category,
        searchDescription: botArticleData.searchDescription,
        coverImage: botArticleData.coverImage,
        publishedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        lang: /[\u0600-\u06FF]/.test(botArticleData.title + " " + botArticleData.content) ? "ar" : "en"
      };

      const updated = [newBotArticle, ...articles];
      setArticles(updated);
      localStorage.setItem('gc_articles', JSON.stringify(updated));

      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastBotPostTime(nowStr);

      triggerToast(`🤖 [Auto Bot]: Successfully published "${botArticleData.title.slice(0, 25)}..." with perfect cover image and tags! 🎉`);
    } catch (err) {
      console.error(err);
      triggerToast('Alert: Bot generation failed to connect to the server.');
    } finally {
      setBotLoading(false);
    }
  };

  // Add/Publish Article
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      triggerToast('Alert: Please write both title and cover content before publishing!');
      return;
    }

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      searchDescription: searchDescription.trim(),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      publishedAt: new Date().toISOString().split('T')[0],
      lang: /[\u0600-\u06FF]/.test(title + " " + content) ? "ar" : "en"
    };

    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem('gc_articles', JSON.stringify(updated));

    // Clear form
    setTitle('');
    setContent('');
    setSearchDescription('');
    setCoverImage('');

    triggerToast('✓ Success! The post has been published and synced with your domain indexes.');
    
    // Auto navigate to Articles Feed to view
    setActiveTab('feed');
  };

  const handleCopyDirectLink = async () => {
    setIsGeneratingDirectLink(true);
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim() || 'Untitled Article Draft',
          content: content.trim() || '',
          category,
          coverImage,
          searchDescription: searchDescription.trim() || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft link');
      }

      const data = await response.json();
      if (data.success && data.draftId) {
        // Construct standard URL format using actual origin and path
        const directLink = `${window.location.origin}${window.location.pathname}?draftId=${data.draftId}`;
        await navigator.clipboard.writeText(directLink);
        triggerToast("📋 Temporary shareable link copied to clipboard! (Expires in 2 hours)");
      }
    } catch (err: any) {
      console.error("Error generating draft link:", err);
      triggerToast("❌ Failed to generate direct link: " + err.message);
    } finally {
      setIsGeneratingDirectLink(false);
    }
  };

  // Handle Edit/Delete
  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this article? This action is irreversible.')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('gc_articles', JSON.stringify(updated));
      triggerToast('Article deleted successfully.');
    }
  };

  const handleEditArticle = (article: Article) => {
    // Populate form with existing values for quick updates
    setTitle(article.title);
    setCategory(article.category);
    setContent(article.content);
    setSearchDescription(article.searchDescription);
    setCoverImage(article.coverImage);
    
    // Switch to write tab
    setActiveTab('write');
    triggerToast('Article draft successfully loaded to editor.');
  };

  // Handle outline draft import from AIPlanner
  const handleInsertDraftFromAI = (draftTitle: string, draftContent: string) => {
    setTitle(draftTitle);
    setContent(draftContent);
    // Auto assign tag based on topic
    const lowerTitle = draftTitle.toLowerCase();
    if (lowerTitle.includes('ai') || lowerTitle.includes('intelligence') || lowerTitle.includes('model')) {
      setCategory('Artificial Intelligence 🧠');
    } else if (lowerTitle.includes('code') || lowerTitle.includes('dev') || lowerTitle.includes('program')) {
      setCategory('Next-Gen Dev 💻');
    } else if (lowerTitle.includes('cyber') || lowerTitle.includes('security') || lowerTitle.includes('attack')) {
      setCategory('Cyber Security 🔒');
    } else {
      setCategory('AdSense Strategy 📊');
    }

    setActiveTab('write');
  };

  const updateAdSense = (newConfig: AdSenseConfig) => {
    setAdsenseConfig(newConfig);
    localStorage.setItem('gc_adsense_config', JSON.stringify(newConfig));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-[#080E1C] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Shared Draft Loader / Reader Full Screen Overlay */}
      {(sharedDraftLoading || sharedDraft || sharedDraftError) && (
        <div className="fixed inset-0 bg-[#08101E] z-50 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 space-y-6">
            
            {/* Elegant Header indicating draft status */}
            <div className="bg-[#122A44] border border-indigo-500/30 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="text-white text-sm font-bold">Temporary Shared Draft Simulator 🔮</h3>
                  <p className="text-indigo-200/70 text-xs">This is a live interactive preview of a draft. Original formatting, layout, and AdSense blocks are preserved.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Direct URL clean to homepage
                  window.history.pushState({}, '', window.location.pathname);
                  setSharedDraft(null);
                  setSharedDraftError(null);
                }}
                className="w-full sm:w-auto bg-[#1C3353] hover:bg-[#25436E] text-white border border-[#2D4F7F] font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer"
              >
                Go to Publisher Platform 🏠
              </button>
            </div>

            {sharedDraftLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-mono tracking-tight animate-pulse">Retrieving secured draft details from host server...</p>
              </div>
            )}

            {sharedDraftError && (
              <div className="bg-[#191015] border border-rose-500/20 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-12">
                <div className="text-4xl">⚠️</div>
                <h4 className="text-white text-base font-bold font-sans">Draft Link Expired or Invalid</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                  {sharedDraftError} Temporary drafts remain active for 2 hours before being safely purged from memory store.
                </p>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', window.location.pathname);
                    setSharedDraft(null);
                    setSharedDraftError(null);
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            )}

            {sharedDraft && (
              <div className="space-y-6 text-left">
                {/* Category, Date & Read Time */}
                <div className="flex flex-wrap items-center gap-2 text-[10.5px] md:text-xs">
                  <span className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                    {sharedDraft.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Created: {new Date(sharedDraft.createdAt || Date.now()).toLocaleTimeString()} (Expires soon)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">By Editorial Staff</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[#38BDF8] font-bold text-[11px]">1 min read</span>
                </div>

                {/* Title */}
                <h1 className="text-white text-2xl md:text-4xl font-extrabold leading-tight tracking-tight font-sans">
                  {sharedDraft.title}
                </h1>

                {/* Metadata List */}
                <div className="border-y border-[#1D2F4E] py-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      👁️ 412 Reads
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      ❤️ 34 Likes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-[11px]">
                    <span className="text-slate-500">Share:</span>
                    <span className="bg-[#18263D] px-2 py-1 rounded text-[10px] hover:text-white cursor-pointer select-none">Twitter</span>
                    <span className="bg-[#18263D] px-2 py-1 rounded text-[10px] hover:text-white cursor-pointer select-none">Facebook</span>
                  </div>
                </div>

                {/* AdSense Placement */}
                {adsenseConfig.enabled && (
                  <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 text-center space-y-1.5 select-none my-4">
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">AdSense Layout Banner Area</span>
                    <p className="text-slate-400 text-[10px] leading-tight font-medium">Matched advertisement based on context keywords: <code className="text-amber-300 font-mono text-[10px]">#{sharedDraft.category.split(' ')[0]}</code></p>
                    <div className="bg-[#14223A] border border-[#233552] rounded-lg py-5 text-slate-500 text-xs font-mono">
                      🤖 [Google Ad Display Placeholder - ID: {adsenseConfig.adSlotId}]
                    </div>
                  </div>
                )}

                {/* Cover Image */}
                <div className="rounded-xl overflow-hidden aspect-video max-h-[400px] bg-slate-900 border border-[#21324E] relative">
                  {sharedDraft.coverImage ? (
                    <img
                      src={sharedDraft.coverImage}
                      alt={sharedDraft.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 bg-gradient-to-br from-[#121F38] to-[#1D2F4E]">
                      <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
                      <span className="text-xs">No cover photo set. Using fallback banner.</span>
                    </div>
                  )}
                </div>

                {/* Meta Description */}
                {sharedDraft.searchDescription && (
                  <div className="bg-[#101D34] border-l-4 border-indigo-500 rounded-r-xl p-4 space-y-1 font-sans">
                    <h5 className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Indexed Google Search snippet (searchDescription)</h5>
                    <p className="text-[#A0AEC0] text-xs italic leading-relaxed font-sans">
                      "{sharedDraft.searchDescription}"
                    </p>
                  </div>
                )}

                {/* Content paragraphs */}
                <div className="prose prose-invert max-w-none text-slate-200 space-y-5 font-sans text-sm md:text-base leading-relaxed pt-2">
                  {sharedDraft.content ? (
                    sharedDraft.content.split('\n').map((para: string, idx: number) => {
                      if (!para.trim()) return <div key={idx} className="h-2" />;
                      return (
                        <p key={idx} className="text-[#CBD5E1] leading-relaxed md:leading-loose">
                          {para}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 italic text-xs">This article contains no content body.</p>
                  )}
                </div>

                {/* Comments Mockup */}
                <div className="border-t border-[#1D2F4E] pt-6 mt-12 space-y-4 font-sans">
                  <h4 className="text-white text-xs font-bold">Reader Comments (Social Mockup)</h4>
                  <div className="bg-[#0D182A] border border-[#1F304B] p-4 rounded-xl space-y-2">
                    <p className="text-slate-400 text-[11px]">No organic comments yet! Be the first to start a conversation regarding this article.</p>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-[#0F1B2F] border-t border-[#1F2F4B] text-center text-slate-500 text-[10px] select-none font-sans">
            Globe Chronicle Media © 2026. All rights reserved. Powered by Server-Driven SEO Optimizer.
          </div>
        </div>
      )}

      {/* Dynamic Dev URL Alert Banner to help direct Google indexer bots correctly */}
      {typeof window !== 'undefined' && window.location.hostname.includes('ais-dev-') && (
        <div className="bg-[#1C0F17] border-b-2 border-rose-500/50 px-4 py-3 text-right shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2 text-rose-300">
              <span className="p-1 bg-rose-500/10 rounded-lg animate-pulse text-[14px]">🚨</span>
              <span className="text-right leading-relaxed">
                <b>سيرفر الموقع ينبهك:</b> لتجاوز تعذر التحقق في قوقل وإثبات الملكية فوراُ، انسخ <b>الرابط العام (Public URL)</b> وضعه في جوجل كونسول بدلاً من رابط التطوير الحالي المغلق.
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
              <span className="bg-[#2D161F] font-mono px-2.5 py-1 text-rose-200 rounded border border-rose-500/20 text-left select-all font-bold text-[11px] outline-none max-w-full truncate" dir="ltr">
                {window.location.origin.replace('ais-dev-', 'ais-pre-')}
              </span>
              <button
                onClick={() => {
                  const dynamicPreUrl = window.location.origin.replace('ais-dev-', 'ais-pre-');
                  navigator.clipboard.writeText(dynamicPreUrl);
                  triggerToast("✓ تم نسخ الرابط العام والمفتوح بنجاح! ضعه في كونسول جوجل الآن 🎉");
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-3.5 py-1.5 rounded-lg active:scale-95 transition cursor-pointer text-[10px] break-keep"
              >
                نسخ الرابط العام الصحيح 📋
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification helper */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#162947] border-2 border-[#384F73] text-indigo-300 font-bold text-xs py-3 px-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 max-w-md text-center"
          >
            <span>✨ {toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navigation container */}
      <header className="border-b border-[#21324E]/40 bg-[#0B1528]/80 backdrop-blur sticky top-0 z-40 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left Brand Title matched beautifully to Globe Chronicle styling */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-left cursor-pointer select-none active:scale-98 transition duration-150"
            title="Globe Chronicle Portal"
          >
            {/* Elegant orange gradient launcher icon */}
            <div className="h-10 w-10 shrink-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/20">
              <span className="text-white text-xl font-black font-sans">G</span>
            </div>
            <div>
              <h1 className="text-white text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1 font-sans">
                Globe Chronicle<span className="text-indigo-500">.</span>
              </h1>
              <p className="text-[#8899A6] text-[10px] hidden sm:block">The Complete General News & Premium Insights Portal</p>
            </div>
          </div>

          {/* Right accessories and quick buttons */}
          <div className="flex items-center gap-2">
            
            {/* Interactive Admin / Visitor View Toggle Switch */}
            <button
              onClick={() => {
                if (isAdmin) {
                  // Switching back to visitor view locks the admin console for maximal security
                  setIsAdmin(false);
                  localStorage.setItem('gc_admin_active', 'false');
                  setIsUnlocked(false);
                  sessionStorage.removeItem('gc_owner_authenticated');
                  triggerToast("🔒 وضع الزائر نشط! هكذا يظهر الموقع للأجانب وعناكب أرشفة جوجل كونسول.");
                } else {
                  if (isUnlocked) {
                    setIsAdmin(true);
                    localStorage.setItem('gc_admin_active', 'true');
                    triggerToast("🔓 تم تفعيل لوحة تحكم المسؤول!");
                  } else {
                    setShowPasscodeModal(true);
                  }
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                isAdmin 
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/20 shadow-sm shadow-indigo-950/20' 
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:bg-slate-700/35 hover:text-white'
              }`}
              title="اضغط للتنقل بين وضع التحكم ووضع عرض الزائر"
              id="header-admin-toggle-switch"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'التحكم | Admin 🟢' : 'الزائر | Public 👥'}</span>
            </button>

            {/* Google AdSense / Google Access Settings Button - Admin Only */}
            {isAdmin && (
              <button
                onClick={() => setIsAdSenseOpen(true)}
                className="px-3 py-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 hover:text-white transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-md shadow-emerald-950/20"
                title="Monetization and Google AdSense settings"
                id="header-adsense-settings-btn"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-sans font-bold">إعلان | AdS💰</span>
              </button>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-[#13223D] border border-[#21324E] hover:bg-[#1C2F52] text-slate-300 hover:text-white transition cursor-pointer"
              title="Toggle system interface theme"
              id="theme-toggler-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Quick Add icon triggers editor - Admin Only */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('write')}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                title="Write New Article"
                id="header-quick-add-btn"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Primary body view content area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs Bar - Only visible in Admin Mode */}
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#20324E]/60 pb-6 mb-8">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-250 cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Articles Feed
            </button>

            <button
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-250 cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Write Article
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-250 cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              SEO Lab
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-255 cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Planner
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-250 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-650 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Metrics & Indexing</span>
            </button>

            <button
              onClick={() => setActiveTab('domain')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold select-none transition duration-250 cursor-pointer ${
                activeTab === 'domain'
                  ? 'bg-gradient-to-r from-teal-650 to-teal-600 text-white shadow-md'
                  : 'bg-[#121F38] text-slate-300 hover:bg-[#1A2C4D] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-450" />
              <span>إعدادات الدومين | Custom Domain</span>
            </button>
          </div>
        )}

        {/* Dynamic rendering with motion fade layout */}
        <div className="min-h-[400px]" id="app-view-layout">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* FEED VIEW */}
              {activeTab === 'feed' && (
                <ArticlesFeed
                  articles={articles}
                  adsenseConfig={adsenseConfig}
                  onEditArticle={handleEditArticle}
                  onDeleteArticle={handleDeleteArticle}
                  isAdmin={isAdmin}
                />
              )}

              {/* Secure Lock Box overlay if visitor tries to force access any management tab while unauthenticated */}
              {activeTab !== 'feed' && !isUnlocked ? (
                <div className="max-w-md mx-auto my-12 bg-[#0B1528] border-2 border-[#1F304B] rounded-2xl p-8 text-center space-y-6 font-sans shadow-2xl relative" id="visitor-restricted-alert" dir="rtl">
                  <div className="h-16 w-16 bg-rose-500/10 rounded-full mx-auto flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-extrabold text-base">منطقة إدارة محظورة وصلاحيات مغلقة 🛑</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      هذا القسم مخصص حصرياً لمالك ومؤسس المدونة لتعديل المقالات والدومين والإعلانات وإثبات الملكية لكونسول جوجل. لا يمتلك الزوار العاديون صلاحية التعديل.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPasscodeModal(true)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95 duration-100"
                  >
                    <Lock className="w-4 h-4 text-white" />
                    <span>تسجيل الدخول وإثبات الملكية كصاحب الموقع 🔑</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* WRITE/EDIT FORM WRAPPED IN A SINGLE COHESIVE FORM FOR THE EXCELLENT SUBMIT DESIGN */}
                  {activeTab === 'write' && (
                <form onSubmit={handlePublish} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Cover image file upload zone & custom submit button */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Character limit search description */}
                      <div className="bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-white text-xs font-semibold flex items-center gap-1">
                            Search Description (Meta)
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{searchDescription.length} / 160</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Write a short search intent summary to rank on Google search snippets and fulfill Google AdSense requirements.
                        </p>
                        <textarea
                          value={searchDescription}
                          onChange={(e) => setSearchDescription(e.target.value.substring(0, 160))}
                          placeholder="An engaging, keyword-targeted search description..."
                          rows={3}
                          className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-3 py-2 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Cover Photo Upload Zone */}
                      <div className="bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-2">
                        <label className="block text-white text-xs font-bold">Blog Cover Image</label>
                        <UploadZone
                          coverImage={coverImage}
                          onCoverImageChange={(url) => setCoverImage(url)}
                          onAlertMessage={triggerToast}
                        />
                      </div>

                      {/* Visually Stunning Action Buttons: Preview Draft + Publish Blog */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!title.trim() && !content.trim()) {
                              triggerToast('Alert: Please write title or content draft to view the visitor preview simulator!');
                              return;
                            }
                            setIsPreviewOpen(true);
                          }}
                          className="flex-[1] bg-[#15233C] hover:bg-[#1B2D4D] text-white font-extrabold text-[#94A3B8] text-xs py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-[#2B3C58]"
                          id="preview-draft-btn"
                        >
                          <Eye className="w-4 h-4 text-indigo-400" />
                          <span>Preview Draft</span>
                        </button>

                        <button
                          type="submit"
                          className="flex-[1.2] bg-gradient-to-r from-indigo-700 to-indigo-650 hover:from-indigo-600 hover:to-indigo-550 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-between shadow-xl shadow-indigo-950/40 cursor-pointer border border-indigo-500/25"
                          id="publish-submit-btn"
                        >
                          <span className="flex items-center gap-2">
                            <PenTool className="w-4 h-4 text-indigo-200" />
                            <span>Publish Article</span>
                          </span>
                          <span className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping shrink-0"></span>
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Title, Content, tag generator and compliance features */}
                    <div className="lg:col-span-7 bg-[#111C30] border border-[#21324E] rounded-xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-[#21324E] pb-3">
                        <h2 className="text-white font-extrabold text-xs">
                          Compose & Edit Blog Post
                        </h2>
                        <span className="text-[10px] bg-[#111C30] border border-[#21324E] text-indigo-400 font-semibold px-2 py-0.5 rounded font-mono">DRAFT ID: {Date.now().toString().slice(-6)}</span>
                      </div>

                      {/* AI Draft Assist Widget in form header */}
                      <div className="bg-[#15233C] border border-indigo-500/20 p-4 rounded-xl space-y-2 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 w-full text-left">
                          <h4 className="text-white text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            Optimize & Suggest SEO Keywords with AI
                          </h4>
                          <p className="text-slate-400 text-[10px] leading-relaxed">
                            Write a brief headline or topic and our expert model will instantly re-write, expand, structure, and tag your draft for optimal Google ranking and AdSense approvals!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAIAutoOptimize}
                          disabled={optimizingDraft}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-extrabold text-[11px] py-1.5 px-3 rounded-lg transition shrink-0 w-full md:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {optimizingDraft ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              <span>Optimizing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Optimize Draft ⚡</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-4 text-left">
                        {/* Title input */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-300 text-xs font-semibold">Article Title:</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a compelling, high-CTR article title..."
                            className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-4 py-2.5 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                          />
                        </div>

                        {/* Category selector */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-300 text-xs font-semibold">Content Category:</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Artificial Intelligence 🧠">Artificial Intelligence 🧠</option>
                            <option value="Next-Gen Dev 💻">Next-Gen Dev 💻</option>
                            <option value="AdSense Strategy 📊">AdSense Strategy 📊</option>
                            <option value="Cyber Security 🔒">Cyber Security 🔒</option>
                          </select>
                        </div>

                        {/* Display Keywords Tags selected by AI (يرتب لي كلمات رمزية) */}
                        {draftKeywords.length > 0 && (
                          <div className="space-y-1.5">
                            <label className="block text-slate-400 text-[10px] font-semibold">AI Generated Keywords & SEO Tags:</label>
                            <div className="flex flex-wrap gap-1.5 font-sans">
                              {draftKeywords.map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="bg-indigo-650/15 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold px-2 py-1 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* EXCLUSIVE FEATURE 1: AdSense Compliance/Readiness Audit Widget and Real-Time meter */}
                        <div className="p-4 bg-indigo-950/20 border border-[#21324E] rounded-xl space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                              Google AdSense Compliance Radar & Audit
                            </span>
                            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              content.split(/\s+/).filter(Boolean).length >= 150 ? 'bg-[#12301A] text-emerald-300' : 'bg-[#302712] text-amber-300'
                            }`}>
                              {content.split(/\s+/).filter(Boolean).length} Words
                            </span>
                          </div>
                          
                          {/* Live Checklist */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${searchDescription.trim() ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                              <span className={searchDescription.trim() ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {searchDescription.trim() ? '✓ Meta Description Verified' : '✗ Meta Description Missing'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${content.split(/\s+/).filter(Boolean).length >= 150 ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                              <span className={content.split(/\s+/).filter(Boolean).length >= 150 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {content.split(/\s+/).filter(Boolean).length >= 150 ? '✓ High-Value Content Length' : '✗ Short Draft (Write 150+ Words)'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${title.trim().length > 15 ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                              <span className={title.trim().length > 15 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {title.trim().length > 15 ? '✓ Compelling Headline Score' : '✗ Headline is Too Short'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${coverImage ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                              <span className={coverImage ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {coverImage ? '✓ Cover Image Set' : '✗ Missing Cover Image'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content rich text area */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-300 text-xs font-semibold">Article Body Content:</label>
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your article details, explanations, and insights here..."
                            rows={10}
                            className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-4 py-3 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>

                    </div>

                  </div>
                </form>
              )}

              {/* SEO LAB VIEW */}
              {activeTab === 'seo' && (
                <SEOLab
                  articles={articles}
                  currentPendingArticle={{
                    title,
                    content,
                    searchDescription
                  }}
                />
              )}

              {/* ANALYTICS & GOOGLE INDEXER VIEW */}
              {activeTab === 'analytics' && (
                <AnalyticsAndIndexing
                  articles={articles}
                />
              )}

              {/* AI PLANNER VIEW WITH AUTOMATION BOT CONTROLLER EMBEDDED TO KEEP THE MAIN NEWS FEED CLEAN */}
              {activeTab === 'planner' && (
                <div className="space-y-6">
                  {/* Bot Automation controller card in the AI Control hub */}
                  <div className="bg-gradient-to-r from-[#111C30] to-[#14233D] border border-indigo-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 w-full md:w-auto">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-indigo-400 animate-bounce" />
                        <h4 className="text-white font-extrabold text-xs">
                          AI Automated Blogging & Optimization Engine
                        </h4>
                        <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">Auto-Bot Active Today</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        The AI agent drafts detailed, SEO-optimized articles every 24 hours, preparing tags and cover photos to accelerate Google AdSense approvals.
                      </p>
                      {lastBotPostTime && (
                        <div className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1 font-mono">
                          <span>Last bot execution was successful at: {lastBotPostTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-start select-none shrink-0">
                      {/* Trigger Instant Bot Gen now button */}
                      <button
                        type="button"
                        onClick={triggerBotArticleGeneration}
                        disabled={botLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#20293D] text-white font-extrabold text-xs py-2 px-4 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 cursor-pointer"
                      >
                        {botLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Drafting content...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Trigger Auto-Bot Now 🤖</span>
                          </>
                        )}
                      </button>

                      {/* Toggle switch active state */}
                      <div className="flex items-center gap-1.5 border-l border-[#21324E] pl-3 font-sans">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={botActive}
                            onChange={(e) => setBotActive(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                        <span className="text-[10px] text-slate-400 font-semibold">{botActive ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <AIPlanner
                    onInsertDraft={handleInsertDraftFromAI}
                    onAlertMessage={triggerToast}
                  />
                </div>
              )}

              {/* CUSTOM DOMAIN VIEW */}
              {activeTab === 'domain' && (
                <CustomDomainSetup onNotify={triggerToast} />
              )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Footer footer layout with credits */}
      <footer className="border-t border-[#20324E]/40 mt-16 py-8 px-4 text-center text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Globe Chronicle. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 font-semibold">Server Security Audit</a>
            <a href="#" className="hover:text-slate-300 font-semibold">Terms & AdSense Regulations</a>
            <a href="#" className="hover:text-slate-300 font-semibold">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* GDPR cookie consent banner */}
      {adsenseConfig.cookieBannerActive && !cookieDismissed && (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-[#111C30]/95 backdrop-blur-md border-2 border-indigo-500/30 p-4 rounded-xl shadow-2xl z-50 animate-feed-enter flex flex-col gap-3 font-sans">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
              <Cookie className="w-5 h-5 text-amber-400" />
            </span>
            <div className="space-y-1">
              <h5 className="text-white text-xs font-bold leading-none">Cookie & Privacy Consent 🍪</h5>
              <p className="text-[#A0AEC0] text-[10px] leading-relaxed">
                This website relies on technical and customization cookies to deliver personalized Google AdSense advertising metrics that match your browsing interests.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCookieDismissed(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg transition cursor-pointer"
            >
              Accept Cookies ✓
            </button>
            <button
              onClick={() => setCookieDismissed(true)}
              className="bg-[#1D2E49] hover:bg-[#2A3E5C] text-slate-300 font-semibold text-[10px] py-1.5 px-3 rounded-lg transition cursor-pointer"
            >
              Manage Preferences
            </button>
          </div>
        </div>
      )}

      {/* Google AdSense Settings top modal displayed from header button click */}
      {isAdSenseOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1528] border-2 border-[#20324E] rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#21324E] pb-3 shrink-0">
              <h3 className="text-white text-sm font-extrabold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span>Google AdSense Access Rules & Monetization Config</span>
              </h3>
              <button
                onClick={() => setIsAdSenseOpen(false)}
                className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 font-extrabold text-[11px] py-1.5 px-4 rounded-xl transition cursor-pointer"
                id="close-adsense-modal-btn"
              >
                Close ✕
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              <AdSenseSettings
                config={adsenseConfig}
                articles={articles}
                onConfigChange={updateAdSense}
                onAlertMessage={triggerToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Passcode Modal (Owner Protection Gate) */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" id="passcode-verification-gate">
          <div className="bg-[#0B1528] border-2 border-[#263C5E] rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-right font-sans" dir="rtl">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="h-14 w-14 bg-gradient-to-tr from-indigo-505 to-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-indigo-950/40">
                <Lock className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h3 className="text-white text-base font-extrabold tracking-tight">
                {!ownerPasscode ? 'تأمين وإثبات ملكية لوحة التحكم 🔒' : 'بوابة التحقق ومصادقة المالك 🛡️'}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                {!ownerPasscode 
                  ? 'يرجى تعيين رقم سري خاص بالمدير لمنع الزوار والغرباء من التعديل وعرض الإعلانات أو المقالات المجهولة.'
                  : 'أدخل الرقم السري للمدير للوصول لتطبيق التحكم ومقالات المدونة المفتوحة.'}
              </p>
            </div>

            {/* Content / Inputs */}
            {!ownerPasscode ? (
              /* SETUP MODE */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs font-bold block">الرمز السري الجديد (أرقام أو حروف):</label>
                  <input
                    type="password"
                    maxLength={16}
                    value={newPasscodeInput}
                    onChange={(e) => setNewPasscodeInput(e.target.value)}
                    className="w-full bg-[#08101C] text-emerald-300 border border-slate-700 focus:border-indigo-500 px-3 py-2.5 rounded-xl text-center font-mono font-bold text-lg tracking-widest placeholder-slate-600 outline-none transition"
                    placeholder="••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs font-bold block">تأكيد الرمز السري:</label>
                  <input
                    type="password"
                    maxLength={16}
                    value={confirmPasscodeInput}
                    onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                    className="w-full bg-[#08101C] text-emerald-300 border border-slate-700 focus:border-indigo-500 px-3 py-2.5 rounded-xl text-center font-mono font-bold text-lg tracking-widest placeholder-slate-600 outline-none transition"
                    placeholder="••••"
                  />
                </div>
                
                <button
                  onClick={() => {
                    if (!newPasscodeInput.trim()) {
                      triggerToast("❌ الرمز السري لا يمكن أن يكون فارغاً!");
                      return;
                    }
                    if (newPasscodeInput !== confirmPasscodeInput) {
                      triggerToast("❌ الرمزان السريان غير متطابقين!");
                      return;
                    }
                    localStorage.setItem('gc_owner_passcode', newPasscodeInput.trim());
                    setOwnerPasscode(newPasscodeInput.trim());
                    setIsUnlocked(true);
                    sessionStorage.setItem('gc_owner_authenticated', 'true');
                    setIsAdmin(true);
                    localStorage.setItem('gc_admin_active', 'true');
                    setShowPasscodeModal(false);
                    setNewPasscodeInput('');
                    setConfirmPasscodeInput('');
                    triggerToast("🎉 تم تعيين رمز الملكية بنجاح وتفعيل لوحة تحكم المالك الخاص بك!");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer shadow-lg"
                >
                  تعيين الرمز وحفظ الملكية فورا 💾
                </button>
              </div>
            ) : (
              /* UNLOCK MODE */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs font-bold block text-center">أدخل الرقم السري للمدير:</label>
                  <input
                    type="password"
                    maxLength={16}
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('submit-unlock-btn')?.click();
                      }
                    }}
                    className="w-full bg-[#08101C] text-emerald-300 border border-slate-700 focus:border-indigo-500 px-3 py-3 rounded-xl text-center font-mono font-extrabold text-xl tracking-widest placeholder-slate-600 outline-none transition"
                    placeholder="••••"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    id="submit-unlock-btn"
                    onClick={() => {
                      if (passcodeInput === ownerPasscode) {
                        setIsUnlocked(true);
                        sessionStorage.setItem('gc_owner_authenticated', 'true');
                        setIsAdmin(true);
                        localStorage.setItem('gc_admin_active', 'true');
                        setShowPasscodeModal(false);
                        setPasscodeInput('');
                        triggerToast("🔓 تم التحقق من الملكية بنجاح! تم فتح لوحة تحكم المالك.");
                      } else {
                        triggerToast("❌ خطأ: الرمز السري غير صحيح!");
                      }
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer shadow-lg text-center font-bold"
                  >
                    تأكيد ومطابقة الرمز 🔑
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowPasscodeModal(false);
                      setPasscodeInput('');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-3 rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      if (confirm("⚠️ هل أنت متأكد من رغبتك في إعادة تعيين الرمز السري؟ سيتم حذف الرمز الحالي وسيتطلب منك إعادة إثبات الملكية لبيئتك المحلية.")) {
                        localStorage.removeItem('gc_owner_passcode');
                        setOwnerPasscode('');
                        setIsUnlocked(false);
                        sessionStorage.removeItem('gc_owner_authenticated');
                        setIsAdmin(false);
                        localStorage.setItem('gc_admin_active', 'false');
                        setPasscodeInput('');
                        triggerToast("🧹 تم مسح الرمز السري الحالي. يمكنك الآن إنشاء رمز سري جديد.");
                      }
                    }}
                    className="text-[10px] text-rose-450/70 hover:text-rose-400 underline"
                  >
                    نسيت الرمز السري؟ إعادة تعيين الملكية ⚠️
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Visitor Article Preview Modal to render exact layout simulation */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1528] border-2 border-[#20324E] rounded-2xl max-w-4xl w-full p-0 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden" id="visitor-preview-modalContainer">
            
            {/* Mock Web Browser URL Address Bar */}
            <div className="bg-[#101B2E] px-4 py-2.5 border-b border-[#1F2E4A]/80 flex items-center justify-between shrink-0 select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="bg-[#18253B] rounded-lg px-4 py-1 text-[10px] text-slate-400 font-mono w-1/2 text-center border border-[#213554] flex items-center justify-center gap-1">
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>globechronicle.build/article/draft-simulation</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                id="close-preview-x"
                title="Exit Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Portal Alert Info */}
            <div className="bg-[#122A44] border-b border-indigo-500/20 px-5 py-2 text-left shrink-0">
              <p className="text-[11px] text-[#A5B4FC] font-sans flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span><b>Visitor Screen Simulator:</b> Previewing layout, images, and text formatting details as they appear on live production.</span>
              </p>
            </div>

            {/* Main Content scroll window */}
            <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar space-y-6 bg-[#08101E] text-left">
              {/* Category, Date & Read Time */}
              <div className="flex flex-wrap items-center gap-2 text-[10.5px] md:text-xs">
                <span className="bg-indigo-650 text-white font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                  {category}
                </span>
                <span className="text-slate-400 font-mono">
                  Published: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">By Editorial Staff</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#38BDF8] font-bold">1 min read</span>
              </div>

              {/* Title display */}
              <h1 className="text-white text-xl md:text-3xl font-extrabold leading-tight tracking-tight font-sans">
                {title || "Untitled Article Draft"}
              </h1>

              {/* Article metadata list */}
              <div className="border-y border-[#1D2F4E] py-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-mono">
                    👁️ {375} Reads
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    ❤️ {28} Likes
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-[11px] text-slate-500">Share:</span>
                  <span className="bg-[#18263D] px-2 py-1 rounded text-[10px] hover:text-white cursor-pointer">Twitter</span>
                  <span className="bg-[#18263D] px-2 py-1 rounded text-[10px] hover:text-white cursor-pointer">Facebook</span>
                  <span className="bg-[#18263D] px-2 py-1 rounded text-[10px] hover:text-white cursor-pointer">Pinterest</span>
                </div>
              </div>

              {/* Standard active AdSense Simulator banner at top if configured */}
              {adsenseConfig.enabled && (
                <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 text-center space-y-1.5 select-none my-4">
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">AdSense Layout Banner Area</span>
                  <p className="text-slate-400 text-[10px] leading-tight">Matched advertisement based on context keywords: <code className="text-amber-300 font-mono">#{category.split(' ')[0]}</code></p>
                  <div className="bg-[#14223A] border border-[#233552] rounded-lg py-5 text-slate-500 text-xs font-mono">
                    🤖 [Google Ad Display Placeholder - ID: {adsenseConfig.adSlotId}]
                  </div>
                </div>
              )}

              {/* Cover image content */}
              <div className="rounded-xl overflow-hidden aspect-video max-h-[360px] bg-slate-900 border border-[#21324E] relative group">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={title || "Cover Image"}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 bg-gradient-to-br from-[#121F38] to-[#1D2F4E]">
                    <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
                    <span className="text-xs">No cover photo set. Using fallback banner.</span>
                  </div>
                )}
              </div>

              {/* Meta query desc preview */}
              {searchDescription && (
                <div className="bg-[#101D34] border-l-4 border-indigo-500 rounded-r-xl p-4 space-y-1 font-sans">
                  <h5 className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Indexed Google Search snippet (searchDescription)</h5>
                  <p className="text-[#A0AEC0] text-xs italic leading-relaxed">
                    "{searchDescription}"
                  </p>
                </div>
              )}

              {/* Main formatted article paragraphs */}
              <div className="prose prose-invert max-w-none text-slate-200 space-y-4 font-sans text-sm md:text-base leading-relaxed pt-2">
                {content ? (
                  content.split('\n').map((para, idx) => {
                    if (!para.trim()) return <div key={idx} className="h-2" />;
                    return (
                      <p key={idx} className="text-[#CBD5E1] leading-relaxed md:leading-loose">
                        {para}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-slate-500 italic text-xs">
                    This article body is empty. Type some content in the editor box to preview how paragraphs, headers, and spacing display.
                  </p>
                )}
              </div>

              {/* Interstitial Ad slot bottom if configured */}
              {adsenseConfig.enabled && (
                <div className="border border-indigo-400/20 bg-indigo-500/5 rounded-xl p-4 text-center space-y-1.5 select-none mt-8">
                  <span className="text-[9px] bg-[#22C55E]/20 text-[#22C55E] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">AdSense Article Footer Placement</span>
                  <p className="text-slate-400 text-[10px] leading-tight">Personalized relevant matches based on page semantics</p>
                  <div className="bg-[#14223A] border border-[#233552] rounded-lg py-4 text-slate-500 text-xs font-mono">
                    💡 [Dynamic Ad Unit - Publisher: {adsenseConfig.publisherId}]
                  </div>
                </div>
              )}

              {/* Backing components */}
              <div className="border-t border-[#1D2F4E] pt-6 mt-12 space-y-4 font-sans">
                <h4 className="text-white text-xs font-bold">Reader Comments (Social Mockup)</h4>
                <div className="bg-[#0D182A] border border-[#1F304B] p-4 rounded-xl space-y-2">
                  <p className="text-slate-400 text-[11px]">No organic comments yet! Be the first to start a conversation regarding this article.</p>
                </div>
              </div>

            </div>

            {/* Bottom operations */}
            <div className="p-4 bg-[#0F1B2F] border-t border-[#1F2F4B] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyDirectLink}
                disabled={isGeneratingDirectLink}
                className="mr-auto bg-emerald-600/20 hover:bg-emerald-600/35 disabled:opacity-50 text-emerald-300 hover:text-white border border-emerald-500/30 font-extrabold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                id="copy-direct-link-btn"
                title="اضغط لإنشاء رابط تجريبي مؤقت ومشاركته مع أي شخص"
              >
                {isGeneratingDirectLink ? (
                  <>
                    <span className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>جاري الإنشاء...</span>
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5" />
                    <span>نسخ رابط مباشر | Copy Draft Link 📋</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="bg-[#1A2D47] hover:bg-[#253D5C] text-slate-200 border border-[#2C415F] font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer"
                id="close-preview-bottom-btn"
              >
                Return to Editor
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setIsPreviewOpen(false);
                  handlePublish(e);
                }}
                className="bg-gradient-to-r from-indigo-700 to-indigo-650 hover:from-indigo-600 hover:to-indigo-550 text-white font-extrabold text-xs py-2 px-5 rounded-xl transition border border-indigo-500/30 cursor-pointer"
                id="preview-publish-direct-btn"
              >
                Publish Directly ✓
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
