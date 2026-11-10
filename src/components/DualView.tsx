import React from 'react';
import { SurveyView } from './SurveyView';
import { DashboardView } from './DashboardView';
import { SurveyResponse } from '../types';
import { Smartphone, MonitorPlay } from 'lucide-react';

interface DualViewProps {
  responses: SurveyResponse[];
  onOpenQr: () => void;
  surveyUrl: string;
}

export const DualView: React.FC<DualViewProps> = ({ responses, onOpenQr, surveyUrl }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 mb-6 text-center">
        <h2 className="text-base md:text-lg font-bold text-indigo-200">
          ↔️ โหมดทดสอบ 2 จอพร้อมกัน (Live Simulation)
        </h2>
        <p className="text-xs md:text-sm text-indigo-300/80 mt-1">
          ลองเลือกคะแนนและกดส่งแบบประเมินในจอมือถือ (ซ้าย) แล้วสังเกตจอด้านขวา (Dashboard) ที่จะอัปเดตตัวเลขและกราฟทันที!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Simulated Phone */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-400" />
              จำลองหน้าจอมือถือผู้เข้าอบรม
            </span>
            <span className="text-[11px] text-slate-400">Mobile-First</span>
          </div>

          <div className="w-full max-w-[420px] bg-slate-900 border-4 border-slate-700/80 rounded-[36px] shadow-2xl p-2 relative overflow-hidden ring-4 ring-indigo-500/20">
            {/* Phone speaker notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 mt-1"></div>
            
            <div className="max-h-[680px] overflow-y-auto rounded-[24px] bg-slate-950">
              <SurveyView isEmbedded={true} />
            </div>

            {/* Phone bottom bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto my-2"></div>
          </div>
        </div>

        {/* Right Side: Dashboard view */}
        <div className="lg:col-span-7">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MonitorPlay className="w-4 h-4 text-indigo-400" />
              จอโปรเจกเตอร์ผู้จัดอบรม (Realtime)
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Sync ทันที 0 วินาที</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <DashboardView responses={responses} onOpenQr={onOpenQr} surveyUrl={surveyUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};
