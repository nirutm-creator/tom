/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  MonitorPlay,
  Columns2,
  Code2,
  QrCode as QrIcon,
  Download,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { DualView } from './components/DualView';
import { QrCodeModal } from './components/QrCodeModal';
import { CodeExportModal } from './components/CodeExportModal';
import {
  getStoredResponses,
  subscribeToResponses,
  exportResponsesToCSV
} from './services/storage';
import { SurveyResponse } from './types';

type ActiveTab = 'survey' | 'dashboard' | 'dual' | 'code';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>(() => getStoredResponses());
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Check URL params on initial load (e.g. ?view=survey or ?view=dashboard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'survey') {
        setActiveTab('survey');
      } else if (viewParam === 'dashboard') {
        setActiveTab('dashboard');
      } else if (viewParam === 'dual') {
        setActiveTab('dual');
      }

      // Compute survey direct URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('view', 'survey');
      setSurveyUrl(currentUrl.toString());
    }
  }, []);

  // Subscribe to realtime updates across browser tabs & storage
  useEffect(() => {
    const unsubscribe = subscribeToResponses((updated) => {
      setResponses(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                Live Survey & Real-Time Dashboard
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                ระบบประเมินความพึงพอใจการอบรม
              </span>
            </div>
          </div>

          {/* Navigation View Switcher (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleTabChange('survey')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'survey'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 หน้าตอบ (มือถือ)</span>
            </button>

            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>🖥️ จอ Dashboard (โปรเจกเตอร์)</span>
            </button>

            <button
              onClick={() => handleTabChange('dual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'dual'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>↔️ ทดสอบ 2 จอพร้อมกัน</span>
            </button>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="เปิด QR Code สำหรับให้ผู้เข้าอบรมสแกน"
            >
              <QrIcon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">QR Code</span>
            </button>

            <button
              onClick={() => exportResponsesToCSV(responses)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition cursor-pointer"
              title="ดาวน์โหลดผลสรุปเป็นไฟล์ CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow transition cursor-pointer"
              title="ดูโค้ดแยก 2 ไฟล์ (survey.html, dashboard.html) และคู่มือ Firebase"
            >
              <Code2 className="w-4 h-4" />
              <span>โค้ด & คู่มือ</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 bg-slate-950/80 justify-around text-xs">
          <button
            onClick={() => handleTabChange('survey')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center ${
              activeTab === 'survey' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            📱 หน้าตอบ
          </button>
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            🖥️ Dashboard
          </button>
          <button
            onClick={() => handleTabChange('dual')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center ${
              activeTab === 'dual' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            ↔️ ซิมูเลชัน
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 py-4 md:py-6">
        {activeTab === 'survey' && (
          <SurveyView
            onSubmitted={() => {
              setResponses(getStoredResponses());
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQr={() => setIsQrOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {activeTab === 'dual' && (
          <DualView
            responses={responses}
            onOpenQr={() => setIsQrOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Real-time Sync Active</span>
            <span>•</span>
            <span>สเกล 1-5 ตามเกณฑ์สถิติมาตรฐาน Likert Scale</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-indigo-400 underline cursor-pointer"
            >
              ดาวน์โหลดโค้ด survey.html & dashboard.html
            </button>
            <span>•</span>
            <button
              onClick={() => setIsQrOpen(true)}
              className="hover:text-indigo-400 cursor-pointer"
            >
              แสดง QR Code
            </button>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Code Export & Firebase Guide Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
