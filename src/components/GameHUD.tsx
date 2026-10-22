import React from 'react';
import { Relic, BonusCard, ChapterId } from '../types/game';
import { Volume2, VolumeX, Sparkles, Compass, HelpCircle } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface GameHUDProps {
  currentChapter: ChapterId;
  relics: Relic[];
  bonusCards: BonusCard[];
  playerX: number;
  playerY: number;
  playerAngle: number;
  nearRelic: Relic | null;
  onUseRelic: () => void;
  onOpenBonusCards: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showHelp: boolean;
  onToggleHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentChapter,
  relics,
  bonusCards,
  playerX,
  playerY,
  playerAngle,
  nearRelic,
  onUseRelic,
  onOpenBonusCards,
  isMuted,
  onToggleMute,
  showHelp,
  onToggleHelp
}) => {
  const chapterRelics = relics.filter(r => r.chapter === currentChapter);
  const recoveredInChapter = chapterRelics.filter(r => r.recovered).length;
  const totalInChapter = chapterRelics.length;
  const progressPercent = Math.round((recoveredInChapter / totalInChapter) * 100);

  const totalBonusCollected = bonusCards.filter(b => b.collected).length;

  // Minimap dimensions & scale (World is 2000x2000, minimap is 120x120)
  const mapSize = 120;
  const worldSize = 2000;
  const scale = mapSize / worldSize;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-4">
      {/* Top Header Bar */}
      <div className="w-full flex items-start justify-between">
        {/* Left: Chapter & Status */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="glass-panel rounded-xl px-3.5 py-2 border border-white/15 flex items-center gap-3 shadow-lg">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                {currentChapter === 1 ? 'LUNAR SECTOR' : 'MARTIAN PLAINS'}
              </div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                {currentChapter === 1 ? 'Chapter 1: The Moon' : 'Chapter 2: Mars'}
              </h1>
            </div>

            <div className="h-6 w-[1px] bg-white/10" />

            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">Recovered</div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                {recoveredInChapter}/{totalInChapter}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="hidden sm:flex flex-col items-center pointer-events-auto">
          <div className="glass-panel px-4 py-1.5 rounded-full border border-white/15 flex items-center gap-3 shadow-lg">
            <span className="text-[10px] font-mono text-slate-300">SECTOR PROGRESS</span>
            <div className="w-36 h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_#38bdf8]"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300">{progressPercent}%</span>
          </div>
        </div>

        {/* Right: Radar Minimap & Quick Actions */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Circular Minimap Radar */}
          <div className="relative glass-panel rounded-2xl p-1.5 border border-white/20 shadow-xl overflow-hidden backdrop-blur-md">
            <div
              style={{ width: `${mapSize}px`, height: `${mapSize}px` }}
              className="relative rounded-xl bg-slate-950/80 overflow-hidden border border-white/10"
            >
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-white/5"></div>
                <div className="border-b border-white/5"></div>
                <div className="border-r border-white/5"></div>
                <div></div>
              </div>

              {/* Concentric radar rings */}
              <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none"></div>
              <div className="absolute inset-7 rounded-full border border-white/5 pointer-events-none"></div>

              {/* Relics on Minimap */}
              {chapterRelics.map(r => {
                const mx = r.x * scale;
                const my = r.y * scale;
                return (
                  <div
                    key={r.id}
                    style={{ left: `${mx}px`, top: `${my}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full flex items-center justify-center ${
                      r.recovered ? 'bg-emerald-500/80' : 'bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]'
                    }`}
                    title={r.name}
                  >
                    <span className="text-[7px]">{r.recovered ? '✓' : ''}</span>
                  </div>
                );
              })}

              {/* Bonus cards on Minimap if collected or nearby */}
              {bonusCards.filter(b => b.chapter === currentChapter && b.collected).map(b => (
                <div
                  key={b.id}
                  style={{ left: `${b.x * scale}px`, top: `${b.y * scale}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_#38bdf8]"
                />
              ))}

              {/* Player dot and facing direction */}
              <div
                style={{
                  left: `${playerX * scale}px`,
                  top: `${playerY * scale}px`,
                  transform: `translate(-50%, -50%) rotate(${playerAngle}rad)`
                }}
                className="absolute w-3 h-3 flex items-center justify-center pointer-events-none"
              >
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]"></div>
                <div className="w-1.5 h-1 bg-cyan-400 absolute translate-x-1 rounded-sm"></div>
              </div>

              {/* Radar label */}
              <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-slate-400 opacity-70">
                SURFACE RADAR
              </div>
            </div>
          </div>

          {/* Quick HUD buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenBonusCards}
              className="px-2.5 py-1 rounded-lg glass-panel hover:bg-white/15 text-[11px] font-mono text-amber-300 flex items-center gap-1 border border-amber-400/20 shadow transition-colors cursor-pointer"
              title="Secret Historical Archives"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Archives ({totalBonusCollected}/4)</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg glass-panel hover:bg-white/15 text-slate-300 border border-white/15 shadow transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
            </button>

            <button
              onClick={onToggleHelp}
              className="p-1.5 rounded-lg glass-panel hover:bg-white/15 text-slate-300 border border-white/15 shadow transition-colors cursor-pointer"
              title="Controls Help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls Help Overlay (Toggleable) */}
      {showHelp && (
        <div className="self-center glass-panel p-4 rounded-xl max-w-sm border border-white/20 text-center pointer-events-auto animate-in fade-in duration-150">
          <h4 className="text-xs font-mono font-bold text-blue-400 uppercase mb-2">Controls Guide</h4>
          <div className="text-xs text-slate-300 space-y-1.5 text-left font-mono">
            <div><span className="text-white font-bold">Desktop:</span> WASD / Arrow Keys to walk.</div>
            <div><span className="text-white font-bold">Mobile:</span> Left thumb virtual joystick.</div>
            <div><span className="text-white font-bold">Interact:</span> Press [E] key or tap "USE" button near relics.</div>
            <div><span className="text-white font-bold">Drone AL-09:</span> Points directly to the next target relic!</div>
          </div>
          <button
            onClick={onToggleHelp}
            className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/15 rounded text-[11px] font-mono text-slate-300 cursor-pointer"
          >
            Got it
          </button>
        </div>
      )}

      {/* Bottom Control Zone */}
      <div className="w-full flex items-end justify-between">
        {/* Left: Desktop Controls Hint (Joystick rendered on canvas for touch) */}
        <div className="hidden sm:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-slate-400">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Use [W, A, S, D] or Arrows to Move · Approach Relic to Inspect</span>
        </div>

        {/* Right: USE Action Button */}
        <div className="pointer-events-auto ml-auto">
          <button
            onClick={() => {
              if (nearRelic) {
                soundEngine.playLockOn();
                onUseRelic();
              }
            }}
            disabled={!nearRelic}
            className={`w-20 h-20 rounded-full font-mono font-extrabold text-sm flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              nearRelic
                ? 'opacity-100 scale-105 pointer-events-auto bg-radial from-blue-500 via-blue-600 to-indigo-700 text-white border-2 border-white/80 shadow-[0_0_25px_rgba(59,130,246,0.8)] animate-pulse'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <span className="text-base tracking-wider">USE</span>
            <span className="text-[9px] font-mono text-blue-200 mt-0.5">[E] / TAP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
