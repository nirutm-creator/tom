import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Users,
  Star,
  Award,
  Download,
  QrCode as QrIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  MessageSquareQuote,
  Trash2,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { SurveyResponse, AggregatedStats } from '../types';
import { RATING_OPTIONS } from '../constants';
import {
  calculateStats,
  exportResponsesToCSV,
  clearAllResponses,
  resetToSampleResponses,
  addRandomMockResponse
} from '../services/storage';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQr: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  onOpenQr,
  surveyUrl
}) => {
  const [stats, setStats] = useState<AggregatedStats>(() => calculateStats(responses));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [miniQrUrl, setMiniQrUrl] = useState<string>('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    setStats(calculateStats(responses));
  }, [responses]);

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(setMiniQrUrl).catch(console.error);
    }
  }, [surveyUrl]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const handleExportCSV = () => {
    exportResponsesToCSV(responses);
  };

  const handleSimulate = () => {
    addRandomMockResponse();
  };

  const handleClear = () => {
    clearAllResponses();
    setShowConfirmClear(false);
  };

  const handleRestoreSample = () => {
    resetToSampleResponses();
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 ${isFullscreen ? 'min-h-screen bg-slate-950 p-8' : ''}`}>
      {/* Top Banner / Organizer Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              Live Real-Time Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            ผลการประเมินความพึงพอใจการอบรม
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            ระบบประมวลผลทันทีเมื่อมีผู้ส่งข้อมูล เหมาะสำหรับการฉายขึ้นจอโปรเจกเตอร์ในห้องสัมมนา
          </p>
        </div>

        {/* Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
            title="เปิด QR Code จอใหญ่"
          >
            <QrIcon className="w-4 h-4" />
            <span>สแกนตอบ (QR Code)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="ดาวน์โหลดไฟล์สรุปผล CSV สำหรับเปิดใน Excel"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={handleSimulate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-medium transition active:scale-95 cursor-pointer"
            title="จำลองคนตอบเพิ่ม 1 คน เพื่อทดสอบการอัปเดตกราฟ"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ จำลองคนตอบ</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'ฉายเต็มจอโปรเจกเตอร์'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* More options menu / reset */}
          <div className="relative inline-block">
            {showConfirmClear ? (
              <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-600/50 p-1 rounded-xl">
                <span className="text-[11px] text-rose-300 px-2 font-medium">ยืนยันล้าง?</span>
                <button
                  onClick={handleClear}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  ล้างหมด
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="ล้างข้อมูลทั้งหมด"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Participants */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">ผู้ตอบแบบสอบถาม</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
              {stats.totalResponses}
            </span>
            <span className="text-slate-400 text-sm font-medium">คน</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>บันทึกเข้าระบบอัตโนมัติ</span>
          </div>
        </div>

        {/* Card 2: Overall Score Average */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">คะแนนเฉลี่ยรวม</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-black text-amber-400 tracking-tight">
              {stats.overallAverage > 0 ? stats.overallAverage.toFixed(2) : '-'}
            </span>
            <span className="text-slate-400 text-sm font-medium">/ 5.00</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-3.5 h-3.5 ${
                  starIdx <= Math.round(stats.overallAverage)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">
              ({stats.overallAverage > 0 ? (stats.overallAverage * 20).toFixed(0) : 0}%)
            </span>
          </div>
        </div>

        {/* Card 3: Five-Level Interpretation */}
        <div className={`rounded-2xl p-5 border shadow-xl relative overflow-hidden flex flex-col justify-between ${stats.interpretation.color}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ระดับความพึงพอใจ</span>
            <Award className="w-5 h-5 opacity-90" />
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {stats.interpretation.level}
            </div>
            <p className="text-xs opacity-90 mt-1 font-medium leading-relaxed">
              {stats.interpretation.description}
            </p>
          </div>
          <div className="mt-3 text-[11px] opacity-75 font-mono">
            เกณฑ์มาตรฐาน 5 ระดับ (Likert Scale)
          </div>
        </div>

        {/* Card 4: Quick Scan QR Card on screen */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
          {miniQrUrl ? (
            <div
              onClick={onOpenQr}
              className="bg-white p-1.5 rounded-xl flex-shrink-0 cursor-pointer hover:scale-105 transition shadow"
              title="คลิกเพื่อขยาย QR Code"
            >
              <img src={miniQrUrl} alt="QR Code" className="w-20 h-20 object-contain rounded" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <QrIcon className="w-8 h-8 text-slate-500" />
            </div>
          )}
          <div className="flex-1">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              สแกนตอบด่วน
            </span>
            <p className="text-xs text-slate-300 font-medium leading-snug">
              เปิดกล้องมือถือสแกนบนหน้าจอเพื่อร่วมประเมิน
            </p>
            <button
              onClick={onOpenQr}
              className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>ขยายเต็มจอ</span> →
            </button>
          </div>
        </div>
      </div>

      {/* Center Grid: Detailed Question Charts + Live Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Question-by-question bar breakdown */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                คะแนนเฉลี่ยรายข้อ & การกระจายตัว (สเกล 1 - 5)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ประเมินแยกตามหมวดหมู่วิทยากร เนื้อหา กิจกรรม สถานที่ และภาพรวม
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              เต็ม 5.00 คะแนน
            </span>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {stats.questionStats.map((qs, index) => {
              const percent = (qs.average / 5) * 100;
              const isTopScore =
                stats.totalResponses > 0 &&
                qs.average === Math.max(...stats.questionStats.map((q) => q.average));

              return (
                <div
                  key={qs.id}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4.5 hover:border-slate-600 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm md:text-base font-semibold text-slate-100">
                            {qs.title}
                          </h3>
                          {isTopScore && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> คะแนนสูงสุด
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">หมวด: {qs.category}</span>
                      </div>
                    </div>

                    {/* Numeric Score */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl md:text-3xl font-black text-indigo-300 font-mono">
                        {qs.average > 0 ? qs.average.toFixed(2) : '-'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        เฉลี่ย ({qs.count} คนตอบ)
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        qs.average >= 4.51
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : qs.average >= 3.51
                          ? 'bg-gradient-to-r from-sky-500 to-indigo-500'
                          : qs.average >= 2.51
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Star Distribution Pills */}
                  <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-750 text-xs">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">การกระจายคะแนน:</span>
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = qs.distribution[rating] || 0;
                        const ratingOpt = RATING_OPTIONS.find((r) => r.value === rating);
                        const pctOfQuestion = qs.count > 0 ? Math.round((count / qs.count) * 100) : 0;
                        return (
                          <div
                            key={rating}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] ${
                              count > 0
                                ? 'bg-slate-800 text-slate-200 border-slate-700'
                                : 'bg-slate-900/60 text-slate-500 border-slate-800'
                            }`}
                            title={`ระดับ ${ratingOpt?.label}: ${count} คน (${pctOfQuestion}%)`}
                          >
                            <span>{rating}★</span>
                            <span className="font-bold text-slate-300 font-mono">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Live Suggestions Feed + Interpretation Guide */}
        <div className="lg:col-span-4 space-y-6">
          {/* Feed of Recent Comments */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">ข้อเสนอแนะล่าสุด</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {stats.recentComments.length} ความคิดเห็น
              </span>
            </div>

            {/* Scrollable comment cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {stats.recentComments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <MessageSquareQuote className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm font-medium">ยังไม่มีข้อเสนอแนะพิมพ์เข้ามา</p>
                  <p className="text-xs mt-1 text-slate-600">
                    ข้อเสนอแนะจากผู้เข้าอบรมจะปรากฏที่นี่แบบเรียลไทม์
                  </p>
                </div>
              ) : (
                stats.recentComments.map((cm) => (
                  <div
                    key={cm.id}
                    className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{cm.overallScore.toFixed(1)}/5</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(cm.timestamp).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                      "{cm.text}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Standard 5-Tier Criteria Info Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 text-xs text-slate-400">
            <h4 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับ
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span>4.51 - 5.00</span>
                <span className="font-bold">มากที่สุด (ดีเยี่ยม)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300">
                <span>3.51 - 4.50</span>
                <span className="font-bold">มาก (ดี)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span>2.51 - 3.50</span>
                <span className="font-bold">ปานกลาง (พอใช้)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
                <span>1.51 - 2.50</span>
                <span className="font-bold">น้อย (ปรับปรุง)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span>1.00 - 1.50</span>
                <span className="font-bold">น้อยที่สุด (เร่งด่วน)</span>
              </div>
            </div>
            {stats.totalResponses === 0 && (
              <button
                onClick={handleRestoreSample}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-sans font-semibold text-xs border border-slate-700 transition"
              >
                โหลดตัวอย่าง 5 ความคิดเห็นสำหรับการทดสอบ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
