import React, { useState } from 'react';
import { ComicChapter } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { ChevronRight, ChevronLeft, FastForward, Play } from 'lucide-react';

interface ComicModalProps {
  comicData: ComicChapter;
  onStartChapter: () => void;
}

export const ComicModal: React.FC<ComicModalProps> = ({ comicData, onStartChapter }) => {
  const [currentPanelIdx, setCurrentPanelIdx] = useState(0);
  const panels = comicData.panels;
  const currentPanel = panels[currentPanelIdx];

  const handleNext = () => {
    soundEngine.playDustWhisk();
    if (currentPanelIdx < panels.length - 1) {
      setCurrentPanelIdx(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    soundEngine.playDustWhisk();
    if (currentPanelIdx > 0) {
      setCurrentPanelIdx(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    soundEngine.playLockOn();
    onStartChapter();
  };

  // Render stylized panel artwork
  const renderPanelArt = (type: string) => {
    switch (type) {
      case 'earth_void':
        return (
          <div className="relative w-full h-44 bg-gradient-to-b from-[#030712] via-[#090d16] to-[#111827] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            {/* Distant Earth marble */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-sky-400 to-emerald-300 shadow-[0_0_30px_rgba(56,189,248,0.5)]"></div>
            {/* Stars */}
            <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-6 right-12 w-1.5 h-1.5 bg-blue-200 rounded-full animate-ping"></div>
            <div className="absolute top-12 right-20 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute inset-x-0 bottom-0 py-1 bg-black/50 text-[10px] font-mono text-center text-slate-400">
              SOLAR SYSTEM SECTOR 03 · C-BAND RELAY
            </div>
          </div>
        );
      case 'orbit_ship':
        return (
          <div className="relative w-full h-44 bg-[#0a0f1d] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-4xl drop-shadow-[0_0_15px_#38bdf8]">🛸</span>
              <div className="w-16 h-0.5 bg-cyan-400/60 blur-[1px] mt-1 animate-pulse"></div>
            </div>
            <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-400">
              DRONE AL-09 ACTIVE
            </div>
          </div>
        );
      case 'boots_touch':
        return (
          <div className="relative w-full h-44 bg-[#141822] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🥾</span>
              <div className="space-y-1">
                <div className="w-12 h-5 rounded-full border-2 border-dashed border-white/30 bg-black/40"></div>
                <div className="w-12 h-5 rounded-full border-2 border-dashed border-white/30 bg-black/40 translate-x-2"></div>
              </div>
            </div>
            <div className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-400">
              LUNAR REGOLITH ARCHIVE
            </div>
          </div>
        );
      case 'crater_glint':
        return (
          <div className="relative w-full h-44 bg-[#111622] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="w-64 h-24 rounded-[100%] border-t-2 border-stone-500 bg-black/60 relative flex items-center justify-center">
              <span className="text-3xl text-amber-300 drop-shadow-[0_0_20px_#f59e0b] animate-bounce">
                ⚡
              </span>
            </div>
            <div className="absolute top-2 left-4 text-[10px] font-mono text-amber-300">
              TARGET COORDINATE ACQUIRED
            </div>
          </div>
        );
      case 'drone_scan':
        return (
          <div className="relative w-full h-44 bg-[#0c1222] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="relative flex flex-col items-center">
              <span className="text-3xl">🤖</span>
              {/* Scan cone */}
              <div className="w-32 h-16 bg-gradient-to-b from-cyan-400/30 to-transparent clip-path-polygon mt-1"></div>
            </div>
            <div className="absolute bottom-2 text-[10px] font-mono text-cyan-300">
              RANGE: 450 METERS · BEACON ACTIVE
            </div>
          </div>
        );
      case 'suit_ready':
        return (
          <div className="relative w-full h-44 bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="text-center">
              <span className="text-5xl">👨‍🚀</span>
              <p className="text-[11px] font-mono text-emerald-400 mt-2 font-bold">
                SYSTEMS ONLINE · PROCEED TO SURFACE
              </p>
            </div>
          </div>
        );
      case 'mars_transfer':
        return (
          <div className="relative w-full h-44 bg-gradient-to-b from-[#1a0a07] to-[#2c130d] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-900 via-red-600 to-amber-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
            </div>
            <div className="absolute bottom-2 text-[10px] font-mono text-red-300">
              INTERPLANETARY VECTOR CONFIRMED
            </div>
          </div>
        );
      case 'dust_entry':
        return (
          <div className="relative w-full h-44 bg-[#230f0a] rounded-xl overflow-hidden flex items-center justify-center border border-red-500/20">
            <div className="text-center">
              <span className="text-4xl">🌪️</span>
              <p className="text-[10px] font-mono text-amber-200 mt-1">
                DUST STORM ADVISORY · VISIBILITY 40%
              </p>
            </div>
          </div>
        );
      case 'ancient_lander':
        return (
          <div className="relative w-full h-44 bg-[#2e150f] rounded-xl overflow-hidden flex items-center justify-center border border-red-500/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛰️</span>
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                VIKING 1 TRANSMITTER DETECTED
              </span>
            </div>
          </div>
        );
      case 'drone_wind':
        return (
          <div className="relative w-full h-44 bg-[#1f0d09] rounded-xl overflow-hidden flex items-center justify-center border border-red-500/20">
            <div className="flex flex-col items-center">
              <span className="text-3xl animate-pulse">🤖</span>
              <span className="text-[10px] font-mono text-red-300 mt-2">
                THRUST VECTOR COMPENSATION: 104%
              </span>
            </div>
          </div>
        );
      case 'helicopter_wings':
        return (
          <div className="relative w-full h-44 bg-[#22120e] rounded-xl overflow-hidden flex items-center justify-center border border-red-500/20">
            <div className="flex flex-col items-center">
              <span className="text-4xl">🚁</span>
              <span className="text-[10px] font-mono text-amber-300 mt-2">
                WRIGHT BROTHERS MUSLIN FABRIC ABOARD
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-44 bg-[#171e2e] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
            <span className="text-4xl">🚀</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 text-slate-100 shadow-2xl border border-white/15">
        {/* Header with Title and Skip */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {comicData.title}
            </h2>
            <p className="text-xs text-blue-300/80 italic font-mono">
              "{comicData.tagline}"
            </p>
          </div>

          <button
            onClick={handleComplete}
            className="flex items-center gap-1 px-3 py-1 text-xs font-mono font-medium rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
          >
            <span>Skip Briefing</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Comic Panel Content */}
        <div className="my-4 space-y-3">
          {/* Panel Artwork */}
          {renderPanelArt(currentPanel.illustrationType)}

          {/* Panel Title & Text */}
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold mb-1">
              <span>{currentPanel.title}</span>
              <span>Panel {currentPanelIdx + 1} of 6</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {currentPanel.caption}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
              {currentPanel.subtext}
            </p>
          </div>
        </div>

        {/* Panel Stepper Dots & Navigation */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {panels.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playDustWhisk();
                  setCurrentPanelIdx(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentPanelIdx ? 'w-6 bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to panel ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentPanelIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-medium text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-mono font-bold text-white shadow-lg shadow-blue-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <span>{currentPanelIdx === panels.length - 1 ? 'Begin Chapter' : 'Next Panel'}</span>
              {currentPanelIdx === panels.length - 1 ? <Play className="w-3.5 h-3.5 fill-white" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
