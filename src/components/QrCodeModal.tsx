import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 480,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [surveyUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'training-survey-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 md:p-8 text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
          <QrIcon className="w-3.5 h-3.5" /> สแกนตอบแบบประเมิน
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
          สแกนผ่านกล้องมือถือ
        </h3>
        <p className="text-slate-400 text-xs mb-5">
          เปิดกล้องบนมือถือแล้วสแกน QR Code เพื่อเข้าสู่หน้าแบบสอบถามทันที
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mx-auto mb-5 border-4 border-indigo-500/20">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Survey QR Code"
              className="w-56 h-56 md:w-64 md:h-64 object-contain rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* URL Box & Action Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300">
            <span className="truncate flex-1 text-left font-mono">{surveyUrl}</span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 flex-shrink-0 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> คัดลอกลิงก์
                </>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              ดาวน์โหลดรูป QR (PNG)
            </button>
            <a
              href={surveyUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              เปิดหน้าใหม่
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
