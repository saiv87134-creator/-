import React, { useState } from 'react';
import { Sparkles, ArrowRight, Send, CheckCircle2, Copy, FileSpreadsheet, ListTodo } from 'lucide-react';

interface AIPlannerProps {
  onInsertDraft: (title: string, content: string) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function AIPlanner({ onInsertDraft, onAlertMessage }: AIPlannerProps) {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [tone, setTone] = useState('Professional & Compelling');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    description: string;
    sections: string[];
    keywords: string[];
  } | null>(null);

  const simulateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPrompt.trim()) {
      if (onAlertMessage) onAlertMessage('Please type an article topic or concept first to generate a structured outline!');
      return;
    }

    setLoading(true);
    setGeneratedResult(null);

    // Realistic typing delay to simulate premium AI streaming
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const lowercasePrompt = topicPrompt.toLowerCase();
    let title = `Comprehensive Guide: ${topicPrompt}`;
    let description = `A detailed article investigating the future of ${topicPrompt} and its strategic implications on sector growth and monetization.`;
    let sections = [
      'Introduction: Theoretical Foundation and Core Concepts',
      `Strategic Importance and Current Innovations in ${topicPrompt}`,
      'Key Opportunities, Technical Roadblocks, and Solutions',
      'Real-World Case Studies and Best Practices',
      'Conclusion & Long-Term Trend Projections'
    ];
    let keywords = [topicPrompt.replace(/\s+/g, ''), 'technology', 'guide', 'business', 'insights'];

    // Custom intelligence based on English keywords
    if (lowercasePrompt.includes('intelligence') || lowercasePrompt.includes('ai') || lowercasePrompt.includes('model')) {
      title = 'The Artificial Intelligence Revolution: Shaping Tomorrow’s Digital Ecosystem 🧠';
      description = 'Explore the paradigms of generative machine learning, enterprise automation, and fine-tuning strategies for developers targeting high-CPC software markets.';
      sections = [
        'Introduction: The Leap from Rule-Based Systems to Generative Transformers',
        'Three Core Catalysts Behind Modern Edge-AI Breakthroughs',
        'Developer Implementation Patterns across Healthcare, Commerce, and Dev Tools',
        'Ethical Dilemmas, Alignment, Guardrails, and Robust Security Best Practices',
        'Future Readiness: How to Position Your Enterprise for Autonomous Workforces'
      ];
      keywords = ['AIRevolution', 'GenerativeAI', 'DigitalTransformation', 'AlgorithmDesign'];
    } else if (lowercasePrompt.includes('program') || lowercasePrompt.includes('code') || lowercasePrompt.includes('dev') || lowercasePrompt.includes('software')) {
      title = 'Ultimate Developer Roadmap for Next-Gen Software Engineering 💻';
      description = 'Practical guidelines and framework topologies to help software architects write clean, scalable, error-free, and highly performant backend codebases.';
      sections = [
        'Introduction: Modern Component Topologies and Language Selection Guidelines',
        'Principles of Maintainable Systems, Refactoring, and Test-Driven Solid Design',
        'Agile Sprint Methodologies, Parallel Branch Flows, and Secure Git Collaboration',
        'AI Assisted Development: Optimizing Coding Velocity safely using LLMs and Copilots',
        'Portfolio Excellence: How to Build Open-Source Applications that Attract Top Global Recruits'
      ];
      keywords = ['SoftwareEngineering', 'CleanCode', 'GitFlow', 'AgileDesign', 'FullStackDev'];
    } else if (lowercasePrompt.includes('seo') || lowercasePrompt.includes('adsense') || lowercasePrompt.includes('search') || lowercasePrompt.includes('rank')) {
      title = 'The Google SEO Masterclass: Dominating Page 1 Search Snippets 📈';
      description = 'Learn the deep technical optimizations, Schema injection methods, and backlink strategies that drive organic user interactions by 250%.';
      sections = [
        'Fundamental Core Web Vitals and Page Rank Rendering Budgets',
        'Strategic Keyword Extraction & Satisfying Reader Search Intent',
        'On-Page Optimization Rules: Semantic Titles, Headings, Meta Description, and Structured Data',
        'Authority Accrual: High-Quality Natural Link Building Protocols and E-E-A-T trust signals',
        'Analytics Dashboard Auditing: Tracking Rank Status and Defeating Algorithm Shifts'
      ];
      keywords = ['TechnicalSEO', 'GooglePageRank', 'SearchIntent', 'OnPageOptimizations', 'BacklinkFunnels'];
    }

    setGeneratedResult({
      title,
      description,
      sections,
      keywords
    });
    setLoading(false);

    if (onAlertMessage) onAlertMessage('AI content framework drafted successfully!');
  };

  const insertGeneratedToEditor = () => {
    if (!generatedResult) return;
    
    // Construct structured post content from sections
    const formattedContent = `${generatedResult.description}\n\n` + 
      generatedResult.sections.map((sec, idx) => `## ${idx + 1}. ${sec}\nDetail your comprehensive research points, tutorials, or engineering deep-dives for Globe Chronicle readers...\n`).join('\n') +
      `\n\nTarget Search Keywords: ${generatedResult.keywords.map(k => '#' + k).join(' - ')}`;

    onInsertDraft(generatedResult.title, formattedContent);
    if (onAlertMessage) onAlertMessage('Draft outline exported to text editor successfully! Go to "Write Article" tab to review.');
  };

  const copyToClipboard = () => {
    if (!generatedResult) return;
    const text = `${generatedResult.title}\n\n${generatedResult.description}\n\n` + generatedResult.sections.join('\n');
    navigator.clipboard.writeText(text);
    if (onAlertMessage) onAlertMessage('Full plan cloned to clipboard successfully!');
  };

  return (
    <div className="space-y-6" id="ai-planner-view">
      {/* Search/Generate bar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters panel */}
        <div className="lg:col-span-4 bg-[#111C30] border border-[#21324E] rounded-xl p-5 space-y-4 h-fit">
          <h3 className="text-white font-bold text-sm flex items-center gap-1.5 border-b border-[#21324E] pb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Content Blueprint Planner
          </h3>

          <form onSubmit={simulateAI} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">Core News Topic or Focus Phrase:</label>
              <textarea
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="e.g., How machine learning model optimization impacts edge-computing performance..."
                rows={3}
                className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-3 py-2 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">Target Niche Category:</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Information Technology">Information Technology & Development</option>
                <option value="Artificial Intelligence">Artificial Intelligence & Data Engineering</option>
                <option value="Finance & Growth">Business & High CPM Finance</option>
                <option value="Cyber Security">Cyber Security & Networks</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-300 text-xs font-semibold">Writing Narrative Tone:</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#18263E] border border-[#2B3C58] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Professional & Compelling">Professional & Authoritative</option>
                <option value="Simplified Tutorial">Educational & Simple Instructions</option>
                <option value="Viral Growth Marketing">Enthusiastic Marketing / Viral Traffic</option>
                <option value="Analytical & Numeric">Academic Analysis with Facts & Data</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#5D5CFF] hover:bg-[#4C4BFF] text-white text-xs font-bold py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Drafting Outline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Blueprint ✨</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Output panel */}
        <div className="lg:col-span-8 bg-[#111C30] border border-[#21324E] rounded-xl p-5 min-h-[300px] flex flex-col justify-between">
          {generatedResult ? (
            <div className="space-y-4 text-left animate-feed-enter">
              <div className="flex items-center justify-between border-b border-[#21324E] pb-3">
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Strategic AI Content Blueprint Ready
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-[#18263D] hover:bg-[#203250] rounded-lg text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px] cursor-pointer"
                    title="Clone blueprint"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Plan</span>
                  </button>
                  <button
                    onClick={insertGeneratedToEditor}
                    className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg transition flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export to Editor 📥</span>
                  </button>
                </div>
              </div>

              {/* Cover Title Idea */}
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold block">Proposed Captivating SEO Headline:</span>
                <h4 className="text-white text-sm font-extrabold">{generatedResult.title}</h4>
              </div>

              {/* Brief Intro */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">AI Recommended Metatag / Search Description:</span>
                <p className="text-slate-300 text-xs leading-relaxed bg-[#15233B] p-3 rounded-lg border border-[#20324E]">{generatedResult.description}</p>
              </div>

              {/* Sections / Table of Contents */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 block">Strategic Outline & Semantic Headings (H2 Layout):</span>
                <div className="space-y-2">
                  {generatedResult.sections.map((sec, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-xs text-slate-200 bg-[#16253C] p-2 rounded border border-[#243754]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#223552] text-indigo-300 w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold">{idx + 1}</span>
                        <span className="font-semibold">{sec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested keywords */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Identified High CPC Search Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedResult.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-indigo-950/40 text-indigo-300 text-[10px] border border-indigo-900/60 rounded px-2 py-0.5">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-3 p-6">
              <div className="bg-[#1C2C47] text-indigo-400 p-4 rounded-full">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-white font-bold text-sm">Design Strategic Content Schemas</h4>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  Enter your core blogging concept in the setup card to output a perfectly structured outline, meta descriptions, and Google-targeted SEO tags.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
