import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadFile = (filename: string) => {
    const a = document.createElement('a');
    a.href = `/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyCode = (url: string) => {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Export Standalone Code
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white mt-1">
              โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'survey'
                ? 'bg-slate-800 text-indigo-300 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-pink-400" />
            <span>1. survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-indigo-300 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>2. dashboard.html (หน้าจอ)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-indigo-300 border-t-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>3. คู่มือติดตั้ง Firebase & Deploy ฟรี</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-950 font-sans">
          {activeTab === 'survey' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    ไฟล์: <code className="text-pink-400">public/survey.html</code>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ไฟล์ HTML หน้าตอบแบบสอบถามเดี่ยว มีระบบสเกล 1-5, ไม่ต้องล็อกอิน, ป้องกันการส่งซ้ำ, ส่งขึ้น Firebase ทันที
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyCode('/survey.html')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('survey.html')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด .html</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                <p className="text-slate-500 mb-2">// ดูโค้ดฉบับเต็มได้โดยการกดปุ่ม "ดาวน์โหลด .html" หรือเปิดที่ /public/survey.html</p>
                <p className="text-indigo-400">&lt;!DOCTYPE html&gt;</p>
                <p>&lt;html lang="th"&gt;</p>
                <p className="pl-4 text-emerald-400">&lt;!-- แบบประเมินความพึงพอใจการอบรม สเกล 1-5 พร้อมระบบป้องกันตอบซ้ำ --&gt;</p>
                <p className="pl-4 text-amber-300">const firebaseConfig = &#123; ... &#125;;</p>
                <p className="pl-4 text-slate-400">databaseRef.push(newRecord); // Realtime Push</p>
                <p>&lt;/html&gt;</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    ไฟล์: <code className="text-emerald-400">public/dashboard.html</code>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ไฟล์ HTML หน้าจอแสดงผลแบบเรียลไทม์ (Chart.js, QR Code Generator, คำนวณ 5 ระดับ, ปุ่มดาวน์โหลด CSV)
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyCode('/dashboard.html')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('dashboard.html')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด .html</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                <p className="text-slate-500 mb-2">// ดูโค้ดฉบับเต็มได้โดยการกดปุ่ม "ดาวน์โหลด .html" หรือเปิดที่ /public/dashboard.html</p>
                <p className="text-indigo-400">&lt;!DOCTYPE html&gt;</p>
                <p>&lt;html lang="th"&gt;</p>
                <p className="pl-4 text-emerald-400">&lt;!-- Real-time Dashboard with Chart.js, QR Code, and CSV Exporter --&gt;</p>
                <p className="pl-4 text-amber-300">surveysRef.on("value", (snapshot) =&gt; &#123; updateUI(); &#125;);</p>
                <p>&lt;/html&gt;</p>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center">1</span>
                  <span>สร้าง Firebase Project (ฟรีตลอดชีพ ไม่มีค่าใช้จ่าย)</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  เข้าไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a> แล้วกด "Create a project" ตั้งชื่อโปรเจกต์ (เช่น training-survey) และกด Create
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center">2</span>
                  <span>เปิด Realtime Database & ตั้งค่า Security Rules</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  ที่เมนูด้านซ้ายเลือก <strong>Build &gt; Realtime Database</strong> แล้วกด <strong>Create Database</strong> (เลือก Location: Singapore)
                </p>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                  <p className="text-slate-500">// ไปที่แท็บ Rules แล้วใส่กฎนี้เพื่อให้ผู้ตอบส่งผลได้โดยไม่ต้องล็อกอิน:</p>
                  <pre>{`{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center">3</span>
                  <span>คัดลอก Config ไปวางใน survey.html และ dashboard.html</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  ไปที่ ⚙️ Project settings &gt; General &gt; Your apps &gt; คลิกไอคอน Web (&lt;/&gt;) แล้วคัดลอก <code>firebaseConfig</code> มาวางในโค้ดทั้ง 2 ไฟล์
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center">4</span>
                  <span>การนำขึ้นเว็บ (Deploy) ฟรี 100%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-100 block mb-1">GitHub Pages (แนะนำ)</span>
                    <p className="text-slate-400">
                      สร้าง repository บน GitHub แล้วอัปโหลด 2 ไฟล์นี้ขึ้นไป เปิดใช้งาน GitHub Pages ในแท็บ Settings จะได้ URL ใช้งานฟรีตลอดไป
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-100 block mb-1">Netlify / Vercel Drop</span>
                    <p className="text-slate-400">
                      ลากโฟลเดอร์ที่มีไฟล์ <code>survey.html</code> และ <code>dashboard.html</code> ไปวางในเว็บ Netlify Drop หรือ Vercel จะได้ลิงก์สดทันทีใน 10 วินาที
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
