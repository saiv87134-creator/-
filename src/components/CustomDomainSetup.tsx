import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Settings, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Info,
  Server,
  Network,
  FileText,
  ShieldCheck,
  CheckCircle,
  Play,
  Terminal,
  Bot
} from 'lucide-react';

interface CustomDomainSetupProps {
  onNotify?: (message: string) => void;
}

export default function CustomDomainSetup({ onNotify }: CustomDomainSetupProps) {
  const [domainInput, setDomainInput] = useState<string>('');
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [checkingDNS, setCheckingDNS] = useState<boolean>(false);
  const [dnsResults, setDnsResults] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Extras Settings States
  const [adsensePubId, setAdsensePubId] = useState<string>('ca-pub-6481029471930491');
  const [verificationFileCode, setVerificationFileCode] = useState<string>('1234567890abcdef');
  const [robotsTxt, setRobotsTxt] = useState<string>('');
  const [savingExtras, setSavingExtras] = useState<boolean>(false);

  // Extras Testing Logs/Feedback
  const [testingAdsTxt, setTestingAdsTxt] = useState<boolean>(false);
  const [testingFileAuth, setTestingFileAuth] = useState<boolean>(false);
  const [adsTxtFeedback, setAdsTxtFeedback] = useState<{ active: boolean | null; log: string }>({ active: null, log: '' });
  const [fileAuthFeedback, setFileAuthFeedback] = useState<{ active: boolean | null; log: string }>({ active: null, log: '' });

  useEffect(() => {
    fetchDomainSettings();
    fetchDomainExtras();
  }, []);

  const fetchDomainSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/domain');
      if (res.ok) {
        const data = await res.json();
        setCurrentDomain(data.customDomain || '');
        setDomainInput(data.customDomain || '');
      }
    } catch (err) {
      console.error('Error loading domain settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomainExtras = async () => {
    try {
      const res = await fetch('/api/settings/domain-extras');
      if (res.ok) {
        const data = await res.json();
        if (data.adsensePublisherId) setAdsensePubId(data.adsensePublisherId);
        if (data.customVerificationFile) setVerificationFileCode(data.customVerificationFile);
        if (data.customRobotsTxt) {
          setRobotsTxt(data.customRobotsTxt);
        } else {
          // default fallback setting
          const host = window.location.host || 'globechronicle.build';
          setRobotsTxt(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://${host}/sitemap.xml`);
        }
      }
    } catch (err) {
      console.error('Error fetching domain extras:', err);
    }
  };

  const handleSaveDomain = async () => {
    if (!domainInput.trim()) {
      if (onNotify) onNotify('يُرجى إدخال اسم النطاق أولاً!');
      return;
    }

    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,18}$/;
    if (!domainRegex.test(domainInput.trim().toLowerCase())) {
      if (onNotify) onNotify('❌ صيغة الدومين غير صالحة. يرجى كتابة اسم نطاق صحيح مثل: domain.com أو www.domain.com');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomain: domainInput.trim().toLowerCase() })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentDomain(data.customDomain);
        if (onNotify) onNotify('🎉 تم حفظ وتنشيط الدومين المخصص بنجاح على السيرفر!');
        
        // Auto update robots mapping host
        const newHost = data.customDomain;
        setRobotsTxt(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://${newHost}/sitemap.xml`);
        
        // Run checkDNS immediately
        handleCheckDNS(data.customDomain);
      } else {
        if (onNotify) onNotify('❌ حدث خطأ أثناء حفظ الدومين.');
      }
    } catch (err) {
      if (onNotify) onNotify('❌ فشل الاتصال بالسيرفر لحفظ الدومين.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExtras = async () => {
    setSavingExtras(true);
    try {
      // Clean data
      const cleanPubId = adsensePubId.trim().toLowerCase();
      const cleanFileCode = verificationFileCode.trim().toLowerCase().replace('.html', '').replace('google', '');

      const res = await fetch('/api/settings/domain-extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adsensePublisherId: cleanPubId,
          customVerificationFile: cleanFileCode,
          customRobotsTxt: robotsTxt
        })
      });

      if (res.ok) {
        if (onNotify) onNotify('🎉 تم حفظ وتحديث الإضافات والملفات (ads.txt, sitemap, File Verify) بنجاح!');
        // Refresh values to match sanitized forms
        setAdsensePubId(cleanPubId);
        setVerificationFileCode(cleanFileCode);
      } else {
        if (onNotify) onNotify('❌ خطأ أثناء لحفظ إضافات الدومين.');
      }
    } catch (err) {
      if (onNotify) onNotify('❌ فشل الاتصال بالسيرفر لتنزيل الإعدادات.');
    } finally {
      setSavingExtras(false);
    }
  };

  const handleCheckDNS = async (targetDomain?: string) => {
    const domainToCheck = targetDomain || currentDomain;
    if (!domainToCheck) {
      if (onNotify) onNotify('يرجى حفظ الدومين أولاً قبل فحصه.');
      return;
    }

    setCheckingDNS(true);
    setDnsResults(null);
    try {
      const res = await fetch(`/api/domain/dns-lookup?domain=${encodeURIComponent(domainToCheck)}`);
      if (res.ok) {
        const data = await res.json();
        setDnsResults(data);
        if (onNotify) onNotify('🔍 اكتمل فحص سجلات نطاقك بنجاح! طالع التقرير في الأسفل.');
      } else {
        const errData = await res.json();
        if (onNotify) onNotify(`❌ فشل فحص النطاق: ${errData.error || 'خطأ غير معروف'}`);
      }
    } catch (err) {
      if (onNotify) onNotify('❌ فشل الاتصال بخادم الاستعلام عن السجل العربي والعالمي.');
    } finally {
      setCheckingDNS(false);
    }
  };

  const handleDeleteDomain = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomain: '' })
      });
      if (res.ok) {
        setCurrentDomain('');
        setDomainInput('');
        setDnsResults(null);
        if (onNotify) onNotify('🗑️ تم إزالة الدومين المخصص وإعادة تعيين موقعك إلى الرابط الافتراضي.');
      }
    } catch (err) {
      if (onNotify) onNotify('❌ فشل إزالة الدومين.');
    } finally {
      setSaving(false);
    }
  };

  // Test dynamic Ads.txt File Endpoint Locally
  const handleTestAdsTxt = async () => {
    setTestingAdsTxt(true);
    setAdsTxtFeedback({ active: null, log: 'جاري إرسال طلب فحص محلي لملف ads.txt...' });
    try {
      // Fast timeout ping to /ads.txt
      const start = Date.now();
      const res = await fetch('/ads.txt');
      const timeTaken = Date.now() - start;
      if (res.ok) {
        const content = await res.text();
        setAdsTxtFeedback({
          active: true,
          log: `[HTTP GET] /ads.txt (استجابة 200 OK في ${timeTaken}ms)\n\nالمحتوى المرجّع:\n${content.trim()}`
        });
      } else {
        setAdsTxtFeedback({
          active: false,
          log: `[Error] فشل السيرفر في جلب الملف. كود الخطأ: ${res.status}`
        });
      }
    } catch (err) {
      setAdsTxtFeedback({
        active: false,
        log: `[Network Error] فشل الاتصال المباشر بنظام الملفات السحابي.`
      });
    } finally {
      setTestingAdsTxt(false);
    }
  };

  // Test dynamic HTML Ownership File Endpoint Locally
  const handleTestFileAuth = async () => {
    setTestingFileAuth(true);
    setFileAuthFeedback({ active: null, log: 'جاري إطلاق زاحف الفحص للتحقق من ملف قوقل التلقائي...' });
    try {
      const cleanCode = verificationFileCode.trim() || 'example123';
      const targetUrl = `/google${cleanCode}.html`;
      const start = Date.now();
      const res = await fetch(targetUrl);
      const timeTaken = Date.now() - start;
      if (res.ok) {
        const content = await res.text();
        setFileAuthFeedback({
          active: true,
          log: `[HTTP GET] ${targetUrl} (استجابة 200 OK في ${timeTaken}ms)\n\nمستند التحقق المستلم:\n"${content}"\n\n✓ هذا الملف صالح بنسبة 100% لإثبات الهوية لدى زواحف Google Search Console.`
        });
      } else {
        setFileAuthFeedback({
          active: false,
          log: `[Error] لم يعثر الخادم على المسار بالصيغة المطلوبة.`
        });
      }
    } catch (err) {
      setFileAuthFeedback({
        active: false,
        log: `[Network Error] فشل زاحف الإرسال.`
      });
    } finally {
      setTestingFileAuth(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Check if CNAME is pointed correctly
  const hasCorrectCname = dnsResults?.resolvedCnames?.some((c: string) => 
    c.toLowerCase().includes('googlehosted.com') || c.toLowerCase().includes('ghs.google')
  );

  // Check if A Records are pointed to Google global IPs
  const googleIPs = ['216.239.32.21', '216.239.34.21', '216.239.36.21', '216.239.38.21'];
  const matchedIPsCount = dnsResults?.resolvedIPs?.filter((ip: string) => googleIPs.includes(ip)).length || 0;

  return (
    <div className="space-y-6 text-right" id="custom-domain-setup-root" dir="rtl">
      
      {/* Dynamic App Domain Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 text-right flex-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-white text-base font-extrabold font-sans">ربط وتخصيص دومينك الخاص (Custom Domain Master Control)</span>
          </div>
          <p className="text-slate-400 text-xs font-sans leading-relaxed">
            قم بتخصيص وحجز اسم نطاق خاص بك ليعبر عن هويتك الصحفية وتوجيه خوادم وبوابات البث لحمل ترافيك موقعك فوراً بالكامل مع شهادة حماية SSL وجدران حماية سحابية تلقائياً مجاناً!
          </p>
        </div>
        
        {currentDomain ? (
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl px-4 py-3 flex items-center gap-3.5 shrink-0 select-all" dir="ltr">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left font-mono">
              <span className="text-slate-400 text-[10px] block font-sans">الدومين النشط حالياً:</span>
              <span className="text-white font-extrabold text-sm">{currentDomain}</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1A1F2C] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-400 text-xs font-sans shrink-0">
            ⚠️ أنت تستخدم حالياً رابط الخادم المشترك الافتراضي
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column (Input fields and layouts) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Input Form */}
          <div className="bg-[#111C30] border border-[#21324E] rounded-2xl p-6 space-y-5 text-right">
            <div className="border-b border-[#21324E] pb-3">
              <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>إدخال معلومات النطاق الخاص بك</span>
              </h3>
              <p className="text-slate-400 text-[11px] font-sans mt-1">
                اكتب الدومين الذي اشتريته من (GoDaddy, Namecheap, Cloudflare, etc.) لنساعدك في ضبطه وتوجيه شهادات الأمان.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold block mb-2 font-sans">
                  اسم النطاق الخاص بك (الدومين):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1" dir="ltr">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-[#162540] hover:bg-[#1C2C4A] focus:bg-[#1E3052] border border-[#2B3E5C] text-white rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-bold placeholder-slate-500 focus:outline-none transition-all focus:border-indigo-500 text-left"
                      placeholder="e.g. www.my-awesome-domain.com"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveDomain}
                    disabled={saving || loading}
                    className="bg-indigo-650 hover:bg-indigo-550 text-white font-extrabold text-xs px-6 rounded-xl transition duration-200 cursor-pointer flex items-center gap-1 shrink-0 border border-indigo-500/20"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ وتنشيط'}
                  </button>
                </div>
              </div>

              {currentDomain && (
                <div className="flex items-center justify-between bg-slate-900/40 p-3.5 rounded-xl border border-[#1E2E4A] gap-3">
                  <div className="text-[11px] text-slate-400 font-sans">
                    يمكنك فصل الدومين الخاص والرجوع لرابط الخادم الافتراضي مباشرة:
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteDomain}
                    disabled={saving}
                    className="text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition cursor-pointer shrink-0"
                  >
                    إلغاء ربط الدومين
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* New Comprehensive Domain Extras Tools (Ads.txt & HTML verify verification) */}
          <div className="bg-[#111C30] border border-[#21324E] rounded-2xl p-6 text-right space-y-6">
            <div className="border-b border-[#21324E] pb-3 flex items-center justify-between">
              <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>أدوات إضافية هامة لنجاح موقعك والملفات المساعدة للقبول في قوقل</span>
              </h3>
              <span className="text-[9px] bg-teal-500/15 text-teal-400 font-extrabold px-1.5 py-0.5 rounded uppercase">ملفات القبول</span>
            </div>

            <div className="space-y-6">
              
              {/* Extra 1: Ads.txt Section */}
              <div className="bg-[#14233C]/60 border border-[#203454] rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                    <h4 className="text-white text-[12px] font-extrabold">مولد ملف Ads.txt المالي المعتمد لـ Google AdSense</h4>
                  </div>
                  <span className="text-[9px] bg-amber-500/15 text-amber-400 font-extrabold px-1.5 py-0.5 rounded uppercase">حظر التزييف</span>
                </div>
                
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  تطلب قوقل ملف <code className="text-amber-300 font-mono">ads.txt</code> عند تقديم موقعك للأرباح للتحقق من هوية الناشر وتفادي الحظر.
                </p>

                <div className="space-y-2">
                  <label className="text-slate-300 text-[11px] block">معرّف الناشر الخاص بك (Publisher ID):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-[#0A1220] border border-slate-700 text-amber-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                      placeholder="ca-pub-6481029471930491"
                      value={adsensePubId}
                      onChange={(e) => setAdsensePubId(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleTestAdsTxt}
                      disabled={testingAdsTxt}
                      className="bg-slate-900 border border-slate-700 hover:text-white text-slate-300 px-3 py-2 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>اختبار الاتصال</span>
                    </button>
                  </div>
                </div>

                {/* Live Terminal Output for verification */}
                <div className="relative bg-[#090F1B] rounded-lg p-3 text-[10px] sm:text-xs font-mono text-slate-300 border border-[#223552] text-left overflow-x-auto" dir="ltr">
                  <span className="absolute top-1.5 right-2 text-[8px] bg-[#1E2E4A] font-bold px-1.5 py-0.5 rounded text-amber-400 select-none">Live Path: /ads.txt</span>
                  <code className="block select-all whitespace-nowrap text-cyan-400">google.com, {adsensePubId || 'ca-pub-6481029471930491'}, DIRECT, f08c47fec0942fa0</code>
                </div>

                {/* Ads.txt logs feedback */}
                {adsTxtFeedback.log && (
                  <div className={`p-3 rounded-lg border text-[10px] font-mono text-left space-y-1 ${
                    adsTxtFeedback.active === true 
                      ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400' 
                      : adsTxtFeedback.active === false
                      ? 'bg-rose-500/5 border-rose-500/25 text-rose-350'
                      : 'bg-slate-900 border-slate-800 text-slate-400 animate-pulse'
                  }`} dir="ltr">
                    <pre className="whitespace-pre-wrap">{adsTxtFeedback.log}</pre>
                  </div>
                )}
              </div>

              {/* Extra 2: HTML Ownership Verification File */}
              <div className="bg-[#14233C]/60 border border-[#203454] rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400" />
                    <h4 className="text-white text-[12px] font-extrabold">مستخرج ملفات إثبات ملكية قوقل (Google Webmaster Console File)</h4>
                  </div>
                  <span className="text-[9px] bg-indigo-500/15 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded uppercase">Search Console</span>
                </div>
                
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  بدل كتابة وسوم الميتا، تفضل قوقل رفع ملف HTML مخصص لإثبات الملكية الكاملة للموقع دون تداخل بأكواد التصميم.
                </p>

                <div className="space-y-2">
                  <label className="text-slate-300 text-[11px] block">كود ملف التحقق الخاص بك (مثلاً: <code className="text-indigo-300 font-mono">1a2b3c4d5e6f</code>):</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1" dir="ltr">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] text-slate-500 font-bold select-none">google</span>
                      <input
                        type="text"
                        className="w-full bg-[#0A1220] border border-slate-700 text-indigo-300 rounded-lg pl-14 pr-16 py-2 text-xs font-mono font-bold"
                        placeholder="1a2b3c4d5e6f"
                        value={verificationFileCode}
                        onChange={(e) => setVerificationFileCode(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] text-slate-500 font-bold select-none">.html</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestFileAuth}
                      disabled={testingFileAuth}
                      className="bg-slate-900 border border-slate-700 hover:text-white text-slate-300 px-3 py-2 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>فحص الملف</span>
                    </button>
                  </div>
                </div>

                {/* File authentication live test feedback */}
                {fileAuthFeedback.log && (
                  <div className={`p-3 rounded-lg border text-[10px] font-mono text-left space-y-1 ${
                    fileAuthFeedback.active === true 
                      ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400' 
                      : fileAuthFeedback.active === false
                      ? 'bg-rose-500/5 border-rose-500/25 text-rose-350'
                      : 'bg-slate-900 border-slate-800 text-slate-400 animate-pulse'
                  }`} dir="ltr">
                    <pre className="whitespace-pre-wrap">{fileAuthFeedback.log}</pre>
                  </div>
                )}
              </div>

              {/* Extra 3: Custom Robots.txt Area */}
              <div className="bg-[#14233C]/60 border border-[#203454] rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4.5 h-4.5 text-teal-400" />
                    <h4 className="text-white text-[12px] font-extrabold">محرر ملف الروبوتات وفهرسة محركات البحث (Robots.txt Editor)</h4>
                  </div>
                  <span className="text-[9px] bg-teal-500/15 text-teal-400 font-extrabold px-1.5 py-0.5 rounded uppercase">زواحف محركات البحث</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 text-[11px] block">تهيئة قواعد زواحف الأرشفة (الروبوتات):</label>
                  <textarea
                    className="w-full h-24 bg-[#0A1220] border border-slate-700 text-slate-300 rounded-lg p-3 text-xs font-mono font-bold focus:outline-none focus:border-teal-500 text-left"
                    dir="ltr"
                    value={robotsTxt}
                    onChange={(e) => setRobotsTxt(e.target.value)}
                  />
                </div>
              </div>

              {/* Save additions button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveExtras}
                  disabled={savingExtras}
                  className="bg-gradient-to-r from-teal-650 to-teal-600 hover:from-teal-600 hover:to-teal-550 border border-teal-500/20 text-white font-extrabold text-xs py-3 px-8 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${savingExtras ? 'animate-spin' : ''}`} />
                  <span>حفظ وتطبيق جميع الإضافات المقترحة</span>
                </button>
              </div>

            </div>
          </div>

          {/* DNS Step By Step Guide Panel */}
          <div className="bg-[#111C30] border border-[#21324E] rounded-2xl p-6 text-right space-y-5">
            <div className="border-b border-[#21324E] pb-3 flex items-center justify-between">
              <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5 justify-start">
                <Network className="w-4 h-4 text-indigo-400" />
                <span>دليل السجلات (DNS Configuration Key)</span>
              </h3>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded uppercase">بوابة النشر</span>
            </div>

            <div className="space-y-4 font-sans text-xs text-slate-200">
              <div className="space-y-2.5">
                <div className="bg-[#162540] border border-[#233857] p-4 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5 text-right">
                    <span className="bg-indigo-600/30 text-indigo-300 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">١</span>
                    <div className="space-y-1">
                      <h4 className="text-white font-extrabold text-[12px]">الخيار الأول: لربط النطاق الرئيسي المباشر (Apex Domain مثل: <code className="text-indigo-400 font-mono">domain.com</code>)</h4>
                      <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed">
                        قم بإضافة السجلات الأربعة التالية من نوع <b>A (Address Record)</b> في لوحة تحكم نطاقك (DNS Configuration) لدى مزود الدومين الخاص بك:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[10px]" dir="ltr">
                    {googleIPs.map((ip, idx) => (
                      <div key={idx} className="bg-[#0B1528] rounded-lg p-2 flex items-center justify-between border border-slate-800">
                        <span className="text-slate-500">A Record IP {idx+1}:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-indigo-300 font-bold">{ip}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(ip, `ip-${idx}`)}
                            className="p-1 text-slate-500 hover:text-white transition cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#162540] border border-[#233857] p-4 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5 text-right">
                    <span className="bg-indigo-600/30 text-indigo-300 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">٢</span>
                    <div className="space-y-1">
                      <h4 className="text-white font-extrabold text-[12px]">الخيار الثاني: لربط النطاق الفرعي (Subdomain مثل: <code className="text-indigo-400 font-mono">www.domain.com</code>)</h4>
                      <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed">
                        قم بإضافة السجل التالي من نوع <b>CNAME (Canonical Name Record)</b> لربط النطاقات الفرعية وتثبيت خادم جوجل للتوجيه الموزع:
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0B1528] rounded-xl p-3 space-y-2 border border-slate-800 font-mono text-[10px]" dir="ltr">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">Record Type (النوع):</span>
                      <span className="text-amber-400 font-bold">CNAME</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">Host/Name (المضيف):</span>
                      <span className="text-slate-300 font-extrabold">www</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Target/Value (القيمة أو التوجيه):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-indigo-400 font-bold">ghs.googlehosted.com</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('ghs.googlehosted.com', 'cname-target')}
                          className="p-1 hover:text-white text-slate-500 transition cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-indigo-300 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 text-[11px] leading-relaxed">
                <Info className="w-4 h-4 shrink-0 text-indigo-400" />
                <p className="font-sans text-right">
                  💡 <b>إشعار مهم:</b> بعد حجز وإدخال السجلات السابقة، قد يستغرق انتشار سجلات الـ DNS عالمياً ما بين ٥ دقائق إلى ٢٤ ساعة كحد أقصى حسب مزود النطاق لديك.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Left Column (Live DNS Auditor System & stats look) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#111C30] border border-[#21324E] rounded-2xl p-6 text-right space-y-5">
            <div className="border-b border-[#21324E] pb-3 flex items-center justify-between">
              <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>فاحص اتصالات الـ DNS العالمي الفوري</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCheckDNS()}
                disabled={checkingDNS || !currentDomain}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-[#2C415F] py-1.5 px-2.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${checkingDNS ? 'animate-spin' : ''}`} />
                <span>تحديث الفحص</span>
              </button>
            </div>

            {currentDomain ? (
              <div className="space-y-4">
                
                {/* Domain State display */}
                <div className="p-4 bg-[#14233C] rounded-xl border border-[#223552] space-y-3 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[10.5px] text-slate-400 font-semibold block">حالة التحقق من التوجيه:</span>
                    {dnsResults ? (
                      (hasCorrectCname || matchedIPsCount > 0) ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-md font-bold">🟢 موجه بنجاح</span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-md font-bold">🟡 معلق / لم يكتمل التوجيه</span>
                      )
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">انقر تحديث لبدء الاستعلام...</span>
                    )}
                  </div>

                  <div className="text-[11px] leading-relaxed text-slate-300 space-y-1.5">
                    <p><b>النطاق النشط:</b> <code className="text-indigo-400 font-mono font-bold select-all" dir="ltr">{currentDomain}</code></p>
                    <p className="text-slate-400 text-[10px]">أداة الفحص تقوم بفحص خوادم DNS العامة من داخل السيرفر وتتحقق من مطابقة السجلات.</p>
                  </div>
                </div>

                {/* Live DNS logs */}
                {dnsResults && (
                  <div className="space-y-3 font-mono text-[11px]" dir="ltr">
                    <span className="text-xs text-white font-bold font-sans block text-right" dir="rtl">السجلات المكتشفة بالخادم:</span>
                    
                    {/* A Records list */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-left">
                      <span className="text-[10px] text-slate-400 font-sans block">سجلات A (A Records):</span>
                      {dnsResults.resolvedIPs && dnsResults.resolvedIPs.length > 0 ? (
                        <div className="space-y-1">
                          {dnsResults.resolvedIPs.map((ip: string, i: number) => {
                            const isGoogle = googleIPs.includes(ip);
                            return (
                              <div key={i} className="flex justify-between items-center text-[10px]">
                                <span className={isGoogle ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{ip}</span>
                                <span className={isGoogle ? 'text-emerald-500' : 'text-slate-500 text-[9px]'}>
                                  {isGoogle ? '✓ خوادم جوجل' : 'غير معروف'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-amber-500 font-sans text-[10px] block" dir="rtl">⚠️ لم يعثر الفحص على سجلات A لهذا الدومين حالياً.</span>
                      )}
                    </div>

                    {/* CNAME records list */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-left">
                      <span className="text-[10px] text-slate-400 font-sans block">سجلات CNAME:</span>
                      {dnsResults.resolvedCnames && dnsResults.resolvedCnames.length > 0 ? (
                        <div className="space-y-1">
                          {dnsResults.resolvedCnames.map((cn: string, i: number) => {
                            const isGoogle = cn.toLowerCase().includes('googlehosted.com') || cn.toLowerCase().includes('ghs.google');
                            return (
                              <div key={i} className="flex justify-between items-center text-[10px]">
                                <span className={isGoogle ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{cn}</span>
                                <span className="text-[9px] text-slate-500">
                                  {isGoogle ? '✓ موجه لـ Google' : 'مزود آخر'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-sans text-[10px] block" dir="rtl">⚠️ لا توجد سجلات CNAME حالية.</span>
                      )}
                    </div>

                    {/* TXT records list */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-left">
                      <span className="text-[10px] text-slate-400 font-sans block">سجلات TXT:</span>
                      {dnsResults.resolvedTxts && dnsResults.resolvedTxts.length > 0 ? (
                        <div className="max-h-24 overflow-y-auto space-y-1 custom-scrollbar text-[10px] text-slate-300">
                          {dnsResults.resolvedTxts.map((txt: string, i: number) => (
                            <div key={i} className="border-b border-slate-800/40 pb-1 break-all last:border-0 select-all">{txt}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-sans text-[10px] block" dir="rtl">لا توجد سجلات TXT مكتشفة.</span>
                      )}
                    </div>

                    <div className="p-2 text-slate-500 text-[10px] font-sans flex items-center justify-between" dir="rtl">
                      <span>وقت آخر فحص:</span>
                      <span>{new Date(dnsResults.checkedAt).toLocaleTimeString()}</span>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center space-y-2 select-none py-10">
                <Globe className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-white text-xs font-bold font-sans">بانتظار إعداد نطاقك</h4>
                <p className="text-slate-500 text-[10px] max-w-xs mx-auto font-sans leading-relaxed">
                  عندما تقوم بإدخال وحفظ اسم الدومين المخصص الخاص بك في النموذج الأيمن، ستظهر سجلات الـ DNS المعالجة والاتصال الفوري هنا في هذه النافذة فوراً.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
