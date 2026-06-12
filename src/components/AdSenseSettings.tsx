import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Info, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  CheckCircle, 
  Code,
  Cookie,
  FileText,
  Copy,
  Check,
  Award,
  AlertTriangle,
  ExternalLink,
  Bot
} from 'lucide-react';
import { AdSenseConfig, Article } from '../types';

interface AdSenseSettingsProps {
  config: AdSenseConfig;
  articles?: Article[];
  onConfigChange: (newConfig: AdSenseConfig) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function AdSenseSettings({ config, articles = [], onConfigChange, onAlertMessage }: AdSenseSettingsProps) {
  const [localPublisherId, setLocalPublisherId] = useState(config.publisherId);
  const [localAdSlotId, setLocalAdSlotId] = useState(config.adSlotId);
  const [localCustomCode, setLocalCustomCode] = useState(config.customCode);
  const [localEnabled, setLocalEnabled] = useState(config.enabled);
  const [localBannerPosition, setLocalBannerPosition] = useState(config.bannerPosition);
  const [localCookieBannerActive, setLocalCookieBannerActive] = useState(config.cookieBannerActive ?? true);

  // States for dynamic copied text indicators
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Modal states for previewing generated mandatory legal pages
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'robots' | null>(null);

  // Simulated live AdSense revenue statistics
  const [stats, setStats] = useState({
    todayRev: 14.80,
    thisMonthRev: 389.20,
    impressions: 5120,
    clicks: 214,
    ctr: 4.18
  });

  // Exclusive CPC / RPM Strategy Calculator states
  const [calcViews, setCalcViews] = useState(15000);
  const [calcCtr, setCalcCtr] = useState(2.8);
  const [calcCpc, setCalcCpc] = useState(0.42);

  useEffect(() => {
    setLocalPublisherId(config.publisherId);
    setLocalAdSlotId(config.adSlotId);
    setLocalCustomCode(config.customCode);
    setLocalEnabled(config.enabled);
    setLocalBannerPosition(config.bannerPosition);
    setLocalCookieBannerActive(config.cookieBannerActive ?? true);
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core validation to guide users
    if (localEnabled) {
      if (localPublisherId && !localPublisherId.startsWith('ca-pub-')) {
        if (onAlertMessage) onAlertMessage('Warning: Publisher ID format usually starts with ca-pub-xxxxxxxxxxxxxxxx');
      }
    }

    onConfigChange({
      enabled: localEnabled,
      publisherId: localPublisherId,
      adSlotId: localAdSlotId,
      customCode: localCustomCode,
      bannerPosition: localBannerPosition,
      cookieBannerActive: localCookieBannerActive
    });

    if (onAlertMessage) {
      onAlertMessage('Google AdSense credentials and compliance rules updated successfully! 💰');
    }
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    if (onAlertMessage) onAlertMessage('Successfully copied to clipboard! 📋');
    setTimeout(() => setCopiedSection(null), 3000);
  };

  const autofillSample = () => {
    setLocalPublisherId('ca-pub-6481029471930491');
    setLocalAdSlotId('1294801948');
    setLocalCustomCode(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481029471930491" crossorigin="anonymous"></script>
<!-- Responsive Globe Chronicle Ad Banner -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6481029471930491"
     data-ad-slot="1294801948"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`);
    if (onAlertMessage) onAlertMessage('Injected standard AdSense simulation tags successfully!');
  };

  // Pre-configured legal texts for standard compliance
  const legalTexts = {
    privacy: `Privacy Policy for Globe Chronicle Blog
Last Updated: June 2026

At Globe Chronicle, we prioritize the confidentiality and security of our online visitors. This policy outlines how user metadata, cookies, and search identifiers are managed to support customized native ads served by Google AdSense and third-party networks.

1. Device Identifiers & Cookies
This website employs technical and functional cookies to log browsing preferences and monitor traffic funnels. Our promotional services, including Google and its advertising partners, use specialized tracking tokens to deliver custom ads based on your historic patterns on our portal and across other domains.

2. Opting Out of Dynamic In-App Tracking
Google uses the DoubleClick cookie system to target specific campaigns effectively. Users may deactivate personalized tracking parameters entirely inside the Google Ad Preferences console or by accepting custom preferences on our unified GDPR Cookie Notification bar.

Contact Us: support@globechronicle.net`,
    
    terms: `Terms and Conditions of Use
Welcome to Globe Chronicle! By browsing this portal, you indicate your commitment to comply with the terms listed below:

1. Intellectual Resource Sharing
All educational blog posts and technology news reports published on Globe Chronicle are trademark properties. Content fragments may be quoted under fair-use agreements on the condition that clear URL citation links pointing back to the source page are explicitly attached.

2. Prevention of Invalid Impressions
Any artificial clicking behaviors, automatic traffic refresh loops, or bot manipulations to trigger mock advertiser credits are strictly forbidden. AdSense code scripts are integrated to secure sovereign and high-quality coverage.`,
    
    robots: `# Automated Sitemap index configurations for Globe Chronicle search agents
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://globechronicle.build/sitemap.xml`
  };

  // Run dynamic Content & Structure Audit for AdSense Acceptance
  const auditResult = () => {
    const totalCount = articles.length;
    const longArticlesCount = articles.filter(a => (a.content || '').split(/\s+/).length >= 100).length;
    
    // Status metrics
    const hasEnoughArticles = totalCount >= 3;
    const hasLongContent = longArticlesCount >= 2;
    const hasMetaDescriptions = articles.every(a => !!a.searchDescription);

    let progress = 30; // base score for framework
    if (localEnabled) progress += 10;
    if (localCookieBannerActive) progress += 20;
    if (hasEnoughArticles) progress += 15;
    if (hasLongContent) progress += 15;
    if (hasMetaDescriptions) progress += 10;

    return {
      totalCount,
      longArticlesCount,
      hasEnoughArticles,
      hasLongContent,
      hasMetaDescriptions,
      progress: Math.min(100, progress)
    };
  };

  const audit = auditResult();

  return (
    <div className="space-y-6 animate-feed-enter" id="adsense-settings-view">
      
      {/* Intro info card */}
      <div className="bg-[#111C30] border border-emerald-500/20 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0 border border-emerald-500/20">
          <DollarSign className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-2xl text-left">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            Google AdSense Compliance, Optimization & Strategy Hub
            <span className="bg-[#0D382B] text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">Approval Accelerator</span>
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            Configure your publisher parameters and execute validation tools to satisfy strict indexing constraints. AdSense mock templates mount automatically in warm zones on our Articles Feed to show dynamic layouts.
          </p>
        </div>
      </div>

      {/* Main AdSense Config Options */}
      <div className="bg-[#111C30] border border-[#21324E] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#21324E] pb-3.5">
          <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            AdSense Publisher Credentials
          </h3>
          <button 
            type="button" 
            onClick={autofillSample}
            className="text-[10px] bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer"
          >
            Load Simulated Demo Script ✨
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-left">
          {/* Main Enable Toggler */}
          <div className="flex items-center justify-between bg-[#19273D] p-3.5 rounded-xl border border-[#283B57]">
            <div className="text-left">
              <span className="text-white text-xs font-bold block">Enable Display Banner Ads</span>
              <span className="text-slate-400 text-[10px] block">Allow sandbox servers to mount simulated monetization graphics</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localEnabled}
                onChange={(e) => setLocalEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Publisher ID input */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">
                Publisher Identifier ID (ca-pub):
              </label>
              <input
                type="text"
                value={localPublisherId}
                onChange={(e) => setLocalPublisherId(e.target.value)}
                placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                className="w-full bg-[#1A2942] border border-[#2D3E5D] rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-left"
              />
              <span className="text-slate-400 text-[10px] block">Your unique advertising partner identification string</span>
            </div>

            {/* Ad Slot ID input */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">
                Creative Slot Code (Ad Slot ID):
              </label>
              <input
                type="text"
                value={localAdSlotId}
                onChange={(e) => setLocalAdSlotId(e.target.value)}
                placeholder="xxxxxxxxxx"
                className="w-full bg-[#1A2942] border border-[#2D3E5D] rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-left"
              />
              <span className="text-slate-400 text-[10px] block">Determines the specific size attributes and colors</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner Position selection */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">
                Placement Topographies (Ad Locations):
              </label>
              <select
                value={localBannerPosition}
                onChange={(e) => setLocalBannerPosition(e.target.value as AdSenseConfig['bannerPosition'])}
                className="w-full bg-[#1A2942] border border-[#2D3E5D] rounded-lg px-3 py-2.5 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Universal Placements (Header, Sidebar, & Inside Feed)</option>
                <option value="top">Top Header Masthead Banner Only</option>
                <option value="sidebar font-bold">Sidebar Right Column Box Only</option>
                <option value="between_articles">Inline Interleaved between every 2nd Article</option>
              </select>
            </div>

            {/* Cookie Banner active consent state */}
            <div className="flex items-center justify-between bg-[#14233B] p-2.5 rounded-lg border border-[#253958] my-auto mt-[22px]">
              <div className="text-left">
                <span className="text-white text-xs font-semibold block flex items-center gap-1">
                  <Cookie className="w-3.5 h-3.5 text-amber-400" />
                  GDPR Privacy & Cookie Consent Banner
                </span>
                <span className="text-slate-400 text-[9px] block">Mandatory legal disclaimer to prevent traffic flags</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={localCookieBannerActive}
                  onChange={(e) => setLocalCookieBannerActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>

          {/* Full Custom HTML block code */}
          <div className="space-y-1.5 col-span-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 text-xs font-semibold">
                HTML Header Script Injection Block:
              </label>
              <span className="text-slate-400 text-[10px]">Paste complete code snippets from AdSense admin</span>
            </div>
            <textarea
              value={localCustomCode}
              onChange={(e) => setLocalCustomCode(e.target.value)}
              placeholder={`<script async src="https://pagead2.googlesyndication.com/..."></script>\n<ins class="adsbygoogle" ...></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`}
              rows={3}
              className="w-full bg-[#1A2942] border border-[#2D3E5D] rounded-lg px-3 py-2 text-white placeholder-slate-650 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-left"
            />
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apply Code Verification ✓</span>
            </button>
          </div>
        </form>
      </div>

      {/* COMPLIANCE DIAGNOSTIC & LEGAL SNIPPETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AdSense Approval Diagnostic scorecard */}
        <div className="lg:col-span-4 bg-[#111C30] border border-[#21324E] rounded-xl p-5 flex flex-col items-center justify-between space-y-4">
          <div className="w-full text-left">
            <h4 className="text-white font-bold text-xs flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" />
              Approval Diagnostics Speedometer
            </h4>
            <div className="border-b border-[#1E2D44] my-2"></div>
          </div>

          {/* score meter */}
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-28 h-28">
              <circle
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="56"
                cy="56"
              />
              <circle
                className="text-emerald-500 transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - audit.progress / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="56"
                cy="56"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-white text-2xl font-extrabold font-mono">{audit.progress}</span>
              <span className="text-emerald-300 text-[9px] block font-semibold">% Ready</span>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="w-full text-left space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>Articles In Portal:</span>
              <span className={`font-mono font-bold ${audit.hasEnoughArticles ? 'text-emerald-400' : 'text-amber-400'}`}>
                {audit.totalCount} / 3 published
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Long-Form Posts (100+ Words):</span>
              <span className={`font-mono font-bold ${audit.hasLongContent ? 'text-emerald-400' : 'text-amber-400'}`}>
                {audit.longArticlesCount} detailed posts
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Semantic Search Desc tags:</span>
              <span className={`font-mono font-bold ${audit.hasMetaDescriptions ? 'text-emerald-400' : 'text-rose-400'}`}>
                {audit.hasMetaDescriptions ? 'All Set ✓' : 'Incomplete ✗'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>GDPR Active Guard:</span>
              <span className={`font-semibold ${localCookieBannerActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                {localCookieBannerActive ? 'Active' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="bg-[#1C2C47] text-[#D1D5DB] text-[10px] p-2.5 rounded-lg leading-relaxed text-left w-full">
            💡 <span className="font-semibold text-emerald-400 font-sans">Pro Strategy:</span> Google rejects sites containing "thin content". Rely on longer automated articles and detailed descriptions to boost evaluation scores.
          </div>
        </div>

        {/* Legal Pages & Sitemap Generator hub */}
        <div className="lg:col-span-8 bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-4">
          <h4 className="text-white font-bold text-sm flex items-center gap-1.5 border-b border-[#21324E] pb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Mandatory Publisher Pages Generator
          </h4>

          <p className="text-slate-300 text-xs text-left leading-relaxed font-sans">
            AdSense review guidelines strictly require clear Privacy policies, Terms, and robots crawler files before authorizing click payouts. Custom generate and copy these template guidelines with 1-click:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Privacy Policy Tool */}
            <div className="bg-[#14233D] border border-[#283C5A] rounded-xl p-3.5 text-center flex flex-col justify-between">
              <div className="space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <h5 className="text-white font-bold text-xs">Privacy Policy</h5>
                <p className="text-slate-400 text-[10px] leading-relaxed font-sans">Explains cookie usages & third-party partner protocols.</p>
              </div>
              <div className="mt-3.5 flex gap-1 justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="bg-[#1A2D4C] hover:bg-[#253E6A] text-indigo-300 text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(legalTexts.privacy, "privacy")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 px-2.5 rounded transition flex items-center gap-0.5 justify-center cursor-pointer"
                >
                  {copiedSection === "privacy" ? <Check className="w-3" /> : 'Copy'}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Tool */}
            <div className="bg-[#14233D] border border-[#283C5A] rounded-xl p-3.5 text-center flex flex-col justify-between">
              <div className="space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <h5 className="text-white font-bold text-xs">Terms of Service</h5>
                <p className="text-slate-400 text-[10px] leading-relaxed font-sans">Protects blog copyrights & forbids synthetic clickable traffic.</p>
              </div>
              <div className="mt-3.5 flex gap-1 justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="bg-[#1A2D4C] hover:bg-[#253E6A] text-emerald-300 text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(legalTexts.terms, "terms")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-2 px-3 rounded transition flex items-center gap-0.5 justify-center cursor-pointer"
                >
                  {copiedSection === "terms" ? <Check className="w-3" /> : 'Copy'}
                </button>
              </div>
            </div>

            {/* Robots & Sitemap tools */}
            <div className="bg-[#14233D] border border-[#283C5A] rounded-xl p-3.5 text-center flex flex-col justify-between">
              <div className="space-y-1">
                <div className="mx-auto w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
                  <Code className="w-4 h-4" />
                </div>
                <h5 className="text-white font-bold text-xs">Robots.txt Sitemap</h5>
                <p className="text-slate-400 text-[10px] leading-relaxed font-sans">Forces search engine spiders to map new blog routes instantly.</p>
              </div>
              <div className="mt-3.5 flex gap-1 justify-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('robots')}
                  className="bg-[#1A2D4C] hover:bg-[#253E6A] text-amber-300 text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(legalTexts.robots, "robots")}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold py-2 px-3 rounded transition flex items-center gap-0.5 justify-center cursor-pointer"
                >
                  {copiedSection === "robots" ? <Check className="w-3" /> : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#15233D] rounded-xl p-4 border border-[#223351] text-xs leading-relaxed text-slate-300 text-left space-y-1.5 flex flex-col font-sans">
            <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Crawler Routing Guidelines:
            </span>
            <span>Once legal snippets are compiled and dynamic URL schemas are indexed, search bots recognize Globe Chronicle as an established news node, speeding up automated page crawl evaluations by 300%.</span>
          </div>
        </div>

      </div>

      {/* Simulator Statistics & Reports */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-sans">
        <div className="bg-[#13223D] border border-[#233555] rounded-xl p-3 text-center">
          <p className="text-slate-400 text-[10px] mb-1 font-semibold">Today’s Earnings</p>
          <div className="text-emerald-400 font-extrabold text-sm font-mono">${stats.todayRev.toFixed(2)}</div>
        </div>
        <div className="bg-[#13223D] border border-[#233555] rounded-xl p-3 text-center">
          <p className="text-slate-400 text-[10px] mb-1 font-semibold">Month-to-Date Return</p>
          <div className="text-white font-extrabold text-sm font-mono">${stats.thisMonthRev.toFixed(2)}</div>
        </div>
        <div className="bg-[#13223D] border border-[#233555] rounded-xl p-3 text-center">
          <p className="text-slate-400 text-[10px] mb-1 font-semibold">Active Impressions</p>
          <div className="text-slate-300 font-semibold text-xs font-mono">{stats.impressions}</div>
        </div>
        <div className="bg-[#13223D] border border-[#233555] rounded-xl p-3 text-center">
          <p className="text-slate-400 text-[10px] mb-1 font-semibold">Valid Ad Clicks</p>
          <div className="text-slate-300 font-semibold text-xs font-mono">{stats.clicks}</div>
        </div>
        <div className="bg-[#13223D] border border-[#233555] rounded-xl p-3 text-center col-span-2 md:col-span-1">
          <p className="text-slate-400 text-[10px] mb-1 font-semibold">Averaged CTR (%)</p>
          <div className="text-indigo-400 font-bold text-xs font-mono">{stats.ctr}%</div>
        </div>
      </div>

      {/* Interactive AdSense Revenue Strategy Calculator */}
      <div className="bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-4">
        <div className="border-b border-[#21324E] pb-2 text-left">
          <h4 className="text-white text-xs font-extrabold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>AdSense Strategy Simulator & Revenue Calculator 📈</span>
          </h4>
          <p className="text-slate-400 text-[10px] mt-0.5 font-sans">
            Play with the sliding inputs to estimate daily/monthly passive revenues. Discover exact CPC goals needed to scale earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left">
          
          {/* Sliders Area */}
          <div className="space-y-4">
            {/* Daily Views Slider */}
            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="font-semibold">Daily Blog Page Views:</span>
                <span className="font-mono font-bold text-slate-300">{calcViews.toLocaleString()} views</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={calcViews}
                onChange={(e) => setCalcViews(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#18263D] rounded-lg appearance-none cursor-pointer accent-[#5D5CFF]"
              />
            </div>

            {/* Click-Through Rate Slider */}
            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="font-semibold">Expected Click-Through Rate (CTR):</span>
                <span className="font-mono font-bold text-slate-300">{calcCtr.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={calcCtr}
                onChange={(e) => setCalcCtr(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#18263E] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* CPC Slider */}
            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="font-semibold">Target Cost Per Click (CPC):</span>
                <span className="font-mono font-bold text-slate-300">${calcCpc.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="3.50"
                step="0.01"
                value={calcCpc}
                onChange={(e) => setCalcCpc(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#18263E] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Results Card Area */}
          <div className="bg-[#13223D] border border-indigo-950/40 rounded-xl p-4 space-y-3">
            <h5 className="text-[11px] text-slate-400 font-bold border-b border-indigo-950/40 pb-1 text-center font-sans">Estimated Monetization Outlook</h5>
            
            <div className="grid grid-cols-3 gap-2 text-center font-sans">
              <div className="bg-[#182847] p-2 rounded-lg">
                <div className="text-[9px] text-slate-400">Daily Return</div>
                <div className="text-emerald-400 text-xs font-extrabold font-mono">
                  ${(calcViews * (calcCtr / 100) * calcCpc).toFixed(2)}
                </div>
              </div>
              <div className="bg-[#182847] p-2 rounded-lg">
                <div className="text-[9px] text-slate-400 font-semibold">Monthly</div>
                <div className="text-white text-xs font-extrabold font-mono">
                  ${(calcViews * (calcCtr / 100) * calcCpc * 30).toFixed(0)}
                </div>
              </div>
              <div className="bg-[#1A2645]/80 p-2 rounded-lg border border-indigo-500/20">
                <div className="text-[9px] text-indigo-300 font-bold">Annualized</div>
                <div className="text-indigo-400 text-xs font-extrabold font-mono">
                  ${(calcViews * (calcCtr / 100) * calcCpc * 365).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Strategic suggestions */}
            <div className="bg-[#1A2944]/50 p-2.5 rounded-lg border border-[#21324E] text-[10px] space-y-1 text-slate-300 font-sans">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Expert CPC Strategic Advise</span>
              </div>
              {calcCpc < 0.20 ? (
                <p>💡 <b>High-Value Focus:</b> Current CPC targets are budget. Write more blog entries regarding "Cyber Security" or "AI Strategies" to immediately secure up to 180% increased click valuation.</p>
              ) : calcCtr < 3.0 ? (
                <p>💡 <b>Optimizing Clicks:</b> Low CTR. Select placement option "Universal Placements" in layout cards to disperse banners intelligently inside active reading regions.</p>
              ) : (
                <p>💡 <b>Elite Publisher Standing:</b> Your ratios are incredible! Keep updating with continuous AI post generations to maximize Google crawler ranks.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Legal modal popup */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border-2 border-[#20324E] rounded-2xl max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl relative font-sans">
            <h4 className="text-white text-base font-extrabold border-b border-[#21324E] pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>{activeModal === 'privacy' ? 'Privacy Policy Document' : activeModal === 'terms' ? 'Terms of Service Contract' : 'Generated Robots.txt file'}</span>
            </h4>
            <textarea
              readOnly
              value={activeModal === 'privacy' ? legalTexts.privacy : activeModal === 'terms' ? legalTexts.terms : legalTexts.robots}
              className="w-full bg-[#16243D] border border-[#273B5B] rounded-xl p-4 text-slate-200 text-xs font-mono leading-relaxed h-80 focus:outline-none focus:ring-0 text-left resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopy(activeModal === 'privacy' ? legalTexts.privacy : activeModal === 'terms' ? legalTexts.terms : legalTexts.robots, activeModal)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === activeModal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === activeModal ? 'Copied!' : 'Copy Entire Snippet'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-[#21314E] hover:bg-[#2C3F62] text-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
