import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Sparkles, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { QUESTIONS, RATING_OPTIONS } from '../constants';
import { saveResponse, hasUserAlreadySubmitted, resetUserSubmissionFlag } from '../services/storage';

interface SurveyViewProps {
  onSubmitted?: () => void;
  isEmbedded?: boolean;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmitted, isEmbedded = false }) => {
  const [scores, setScores] = useState<{ [key: number]: number }>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasUserAlreadySubmitted()) {
      setSubmitted(true);
    }
  }, []);

  const handleSelectScore = (questionId: number, score: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score
    }));
    if (errorMsg) setErrorMsg('');
  };

  const answeredCount = Object.keys(scores).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount < QUESTIONS.length) {
      const missingQuestions = QUESTIONS.filter((q) => !scores[q.id]).map((q) => q.id);
      setErrorMsg(`กรุณาให้คะแนนให้ครบทุกข้อ (ยังขาดข้อ ${missingQuestions.join(', ')})`);
      return;
    }

    setIsSubmitting(true);

    try {
      saveResponse({
        scores,
        comment: comment.trim()
      });

      // Fire confetti celebratory effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas-confetti fails
      }

      setSubmitted(true);
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    resetUserSubmissionFlag();
    setSubmitted(false);
    setScores({});
    setComment('');
    setErrorMsg('');
  };

  if (submitted) {
    return (
      <div className={`w-full max-w-xl mx-auto ${isEmbedded ? 'p-4' : 'p-6 md:p-8'}`}>
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> บันทึกข้อมูลสำเร็จ
          </span>

          <h2 className="text-2xl font-bold text-white mb-2">ขอบคุณสำหรับความคิดเห็น!</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            คำตอบของคุณถูกส่งเข้าสู่ระบบ Dashboard ของห้องอบรมเรียบร้อยแล้ว ทุกเสียงมีคุณค่าต่อการพัฒนาหลักสูตรของเรา
          </p>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-400 mb-6 text-left space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>สถานะระบบ</span>
              <span className="text-emerald-400 flex items-center gap-1">● ส่งแล้ว</span>
            </div>
            <div>• ระบบไม่เก็บชื่อ นามสกุล หรือข้อมูลส่วนบุคคลของคุณ (Anonymous)</div>
            <div>• บันทึกการตอบเครื่องนี้เรียบร้อย (ระบบป้องกันการตอบซ้ำอัตโนมัติ)</div>
          </div>

          <button
            onClick={handleResetForTesting}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            ทดสอบตอบใหม่อีกครั้ง (Demo Reset)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-xl mx-auto ${isEmbedded ? 'p-3' : 'p-4 md:p-6'} pb-16`}>
      {/* Header Info */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> แบบประเมินผลออนไลน์
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          โปรดเลือกคะแนนตามความพึงพอใจของท่าน (สเกล 1 - 5) ไม่ต้องระบุชื่อ
        </p>

        {/* Progress Bar */}
        <div className="mt-5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span>ความคืบหน้า</span>
            <span className="font-semibold text-indigo-400">
              ตอบแล้ว {answeredCount} จาก {QUESTIONS.length} ข้อ ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error alert if missing answers */}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions list */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {QUESTIONS.map((q, idx) => {
          const selectedVal = scores[q.id];
          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl transition-all duration-200 border ${
                selectedVal
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-base leading-snug">
                      {q.title}
                    </h3>
                    {q.description && (
                      <p className="text-xs text-slate-400 mt-1">{q.description}</p>
                    )}
                  </div>
                </div>
                {selectedVal && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex-shrink-0">
                    {selectedVal} คะแนน
                  </span>
                )}
              </div>

              {/* Rating Scale Buttons (1-5) */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = selectedVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectScore(q.id, opt.value)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 active:scale-95 min-h-[72px] cursor-pointer ${
                        isSelected
                          ? `${opt.color} text-white font-bold border-transparent shadow-md scale-[1.04] ring-2 ring-white/30`
                          : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xl md:text-2xl mb-1 filter drop-shadow">{opt.emoji}</span>
                      <span className="text-base font-bold leading-none">{opt.value}</span>
                      <span className="text-[10px] opacity-80 mt-1 leading-tight text-center line-clamp-1">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Comment Box */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <label className="block text-sm font-medium text-slate-200 mb-1.5 flex items-center justify-between">
            <span>ข้อเสนอแนะเพิ่มเติม / ความคิดเห็น (ไม่บังคับ)</span>
            <span className="text-xs text-slate-500">พิมพ์ได้อิสระ</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เช่น สิ่งที่ประทับใจ, หัวข้อที่อยากให้จัดอบรมเพิ่มเติม, ข้อเสนอแนะแก่วิทยากรหรือทีมงาน..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition duration-200 active:scale-[0.98] cursor-pointer ${
              answeredCount === QUESTIONS.length
                ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-indigo-500/25 ring-2 ring-white/10'
                : 'bg-slate-800 text-slate-400 border border-slate-700/80 hover:bg-slate-750'
            }`}
          >
            {isSubmitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>ส่งแบบประเมินความพึงพอใจ</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-2.5">
            🔒 ระบบไม่ระบุตัวตน ปลอดภัย และบันทึกผลไปยังหน้าจอ Dashboard ทันที
          </p>
        </div>
      </form>
    </div>
  );
};
