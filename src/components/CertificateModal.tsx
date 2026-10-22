import React, { useState, useRef } from 'react';
import { Relic, BonusCard } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Download, Award, Clock, Trophy, RefreshCw, FileCode } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/exportHtml';

interface CertificateModalProps {
  relics: Relic[];
  bonusCards: BonusCard[];
  elapsedSeconds: number;
  onRestart: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  relics,
  bonusCards,
  elapsedSeconds,
  onRestart
}) => {
  const [playerName, setPlayerName] = useState('Commander Explorer');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const recoveredCount = relics.filter(r => r.recovered).length;
  const bonusCount = bonusCards.filter(b => b.collected).length;

  const handleDownloadCertificate = () => {
    soundEngine.playSuccess();
    setIsGenerating(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (Deep Space Navy with Parchment Border)
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
    bgGrad.addColorStop(0, '#070b14');
    bgGrad.addColorStop(0.5, '#0d1527');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1100);

    // Subtle starfield
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * 1600;
      const sy = (Math.cos(i * 321.54) * 0.5 + 0.5) * 1100;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer Gold Borders
    ctx.strokeStyle = '#d4af37'; // Antique Gold
    ctx.lineWidth = 10;
    ctx.strokeRect(40, 40, 1520, 1020);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1490, 990);

    // Decorative corner notches
    const corners = [
      [55, 55], [1545, 55], [55, 1045], [1545, 1045]
    ];
    ctx.fillStyle = '#d4af37';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.fillText('AFTERLIGHT: HISTORICAL RETRIEVAL PROGRAM', 800, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICIAL CERTIFICATE OF RECOVERY', 800, 205);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 22px Georgia, serif';
    ctx.fillText('This archival parchment hereby confirms and honors the historical preservation directives executed by:', 800, 260);

    // Player Name Underline & Text
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
    const displayRecipient = playerName.trim() || 'Commander Explorer';
    ctx.fillText(displayRecipient.toUpperCase(), 800, 340);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(450, 360);
    ctx.lineTo(1150, 360);
    ctx.stroke();

    // Mission Debrief Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "Space Mono", monospace';
    ctx.fillText('DESIGNATION: LEAD EXTRATERRESTRIAL ARTIFACT RESTORATION SPECIALIST', 800, 410);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      'Having successfully navigated both the Lunar Regolith and Martian Deserts to locate, recalibrate, and preserve humanity\'s earliest cosmic relics.',
      800,
      460
    );

    // Relics Stamp Grid (6 Cards)
    const relicStartX = 180;
    const relicSpacing = 210;
    const relicY = 570;

    relics.forEach((r, idx) => {
      const rx = relicStartX + idx * relicSpacing;
      // Stamp background
      ctx.fillStyle = r.recovered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(rx, relicY, 180, 160);

      ctx.strokeStyle = r.recovered ? '#10b981' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, relicY, 180, 160);

      // Icon & Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '40px sans-serif';
      ctx.fillText(r.icon, rx + 90, relicY + 60);

      ctx.fillStyle = r.recovered ? '#34d399' : '#64748b';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      const shortName = r.name.split(' ')[0] + ' ' + (r.name.split(' ')[1] || '');
      ctx.fillText(shortName, rx + 90, relicY + 105);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Space Mono", monospace';
      ctx.fillText(r.recovered ? '✓ RESTORED' : 'PENDING', rx + 90, relicY + 135);
    });

    // Mission Stats Badges
    const statsY = 820;

    // Box 1: Time Elapsed
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(260, statsY, 320, 90);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(260, statsY, 320, 90);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillText('MISSION DURATION', 420, statsY + 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Space Mono", monospace';
    ctx.fillText(formatTime(elapsedSeconds), 420, statsY + 70);

    // Box 2: Relics Recovered
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(640, statsY, 320, 90);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(640, statsY, 320, 90);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillText('RELICS RESTORED', 800, statsY + 32);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 28px "Space Mono", monospace';
    ctx.fillText(`${recoveredCount} / ${relics.length} COMPLETE`, 800, statsY + 70);

    // Box 3: Bonus Archives
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(1020, statsY, 320, 90);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(1020, statsY, 320, 90);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillText('SECRET ARCHIVES FOUND', 1180, statsY + 32);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px "Space Mono", monospace';
    ctx.fillText(`${bonusCount} / ${bonusCards.length} DISCOVERED`, 1180, statsY + 70);

    // Official Seal / Footnote
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Space Mono", monospace';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`AUTHENTICATION DATE: ${dateStr.toUpperCase()} · VERIFIED BY AUTONOMOUS DRONE AL-09`, 800, 980);

    // Trigger Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Afterlight_Recovery_Certificate_${displayRecipient.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setIsGenerating(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl p-6 text-slate-100 shadow-2xl border border-white/20 my-auto text-center">
        {/* Top Trophy Graphic */}
        <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          MISSION ACCOMPLISHED
        </h2>
        <p className="text-xs text-blue-300 font-mono mt-1">
          Humanity's Historical Relics Have Been Successfully Restored
        </p>

        {/* Stats Pill Matrix */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Total Time</div>
            <div className="text-sm font-mono font-bold text-white mt-0.5">{formatTime(elapsedSeconds)}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Relics Recovered</div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{recoveredCount} / {relics.length}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Secret Archives</div>
            <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{bonusCount} / {bonusCards.length}</div>
          </div>
        </div>

        {/* Name Input for Certificate */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 my-4 text-left">
          <label htmlFor="commander-name" className="text-xs font-mono font-bold text-slate-300 block mb-1">
            Explorer Name / Callsign for Official Certificate (Max 20 chars):
          </label>
          <input
            id="commander-name"
            type="text"
            maxLength={20}
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="e.g. Commander Neil"
            className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-mono font-bold text-sm text-white shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Rendering Archival Canvas...' : 'Download Official Certificate (PNG)'}</span>
          </button>

          <button
            onClick={() => {
              const html = generateStandaloneHtml();
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Afterlight_Recovery_Single_File.html';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 text-xs font-mono font-medium text-blue-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Download Standalone Single-File Game (.html)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-medium text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replay Mission From Chapter 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
