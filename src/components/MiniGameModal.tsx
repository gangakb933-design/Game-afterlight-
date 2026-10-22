import React, { useState, useEffect, useRef } from 'react';
import { Relic } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

interface MiniGameModalProps {
  relic: Relic;
  onComplete: () => void;
  onClose: () => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({ relic, onComplete, onClose }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // --- Relic 1: Apollo ALSEP Cable Connection ---
  const [cables, setCables] = useState<Record<string, string | null>>({
    '12V': null,
    '28V': null,
    '5V': null
  });
  const [selectedCable, setSelectedCable] = useState<string | null>(null);

  // --- Relic 2: Lunar Rover Dust Cleaning ---
  const [dustPatches, setDustPatches] = useState<{ id: number; x: number; y: number; size: number; cleaned: boolean }[]>([
    { id: 1, x: 22, y: 35, size: 42, cleaned: false },
    { id: 2, x: 50, y: 25, size: 38, cleaned: false },
    { id: 3, x: 75, y: 40, size: 45, cleaned: false },
    { id: 4, x: 35, y: 65, size: 40, cleaned: false },
    { id: 5, x: 65, y: 70, size: 48, cleaned: false },
    { id: 6, x: 82, y: 20, size: 36, cleaned: false }
  ]);

  // --- Relic 3: Surveyor 3 Reticle Alignment ---
  const [alignmentAngle, setAlignmentAngle] = useState(0);
  const [lockSteps, setLockSteps] = useState(0); // Needs 3 locks
  const [reticleFeedback, setReticleFeedback] = useState<string | null>(null);

  // --- Relic 4: Viking Lander Soil Scoop ---
  const [scoopProgress, setScoopProgress] = useState<'idle' | 'scooping' | 'carrying' | 'analyzing'>('idle');
  const [soilSamples, setSoilSamples] = useState([false, false, false]);

  // --- Relic 5: Phoenix Lander Ice Trench ---
  const [iceDepth, setIceDepth] = useState(0); // 0 to 100%
  const [isDraggingIce, setIsDraggingIce] = useState(false);
  const lastTouchYRef = useRef<number>(0);

  // --- Relic 6: Ingenuity Helicopter Altitude Balance ---
  const [altitude, setAltitude] = useState(40); // 0 to 100%
  const [flightTimeInZone, setFlightTimeInZone] = useState(0); // Target: 4.0 seconds
  const isLiftingRef = useRef(false);

  // Reset function
  const handleReset = () => {
    soundEngine.playDustWhisk();
    setCables({ '12V': null, '28V': null, '5V': null });
    setSelectedCable(null);
    setDustPatches(p => p.map(item => ({ ...item, cleaned: false })));
    setLockSteps(0);
    setReticleFeedback(null);
    setScoopProgress('idle');
    setSoilSamples([false, false, false]);
    setIceDepth(0);
    setAltitude(40);
    setFlightTimeInZone(0);
    setIsCompleted(false);
  };

  // Check completion trigger
  const triggerSuccess = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    soundEngine.playSuccess();
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  // --- Game 1: Apollo ALSEP Logic ---
  const handleConnectPort = (portVoltage: string) => {
    if (!selectedCable) return;
    soundEngine.playWirePlug();
    const updated = { ...cables, [portVoltage]: selectedCable };
    setCables(updated);
    setSelectedCable(null);

    // Check if 12V, 28V, and 5V are all correctly connected
    if (updated['12V'] === '12V' && updated['28V'] === '28V' && updated['5V'] === '5V') {
      triggerSuccess();
    }
  };

  // --- Game 2: Lunar Rover Logic ---
  const handleCleanPatch = (id: number) => {
    soundEngine.playDustWhisk();
    const nextPatches = dustPatches.map(p => p.id === id ? { ...p, cleaned: true } : p);
    setDustPatches(nextPatches);
    if (nextPatches.every(p => p.cleaned)) {
      triggerSuccess();
    }
  };

  // --- Game 3: Surveyor 3 Reticle Animation ---
  useEffect(() => {
    if (relic.id !== 3 || isCompleted) return;
    const interval = setInterval(() => {
      setAlignmentAngle(prev => (prev + 3.5) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [relic.id, isCompleted]);

  const handleReticleTap = () => {
    // Target zone is between 75° and 105° (at bottom right / 90° center)
    const normalized = alignmentAngle;
    const isWithinTarget = (normalized >= 75 && normalized <= 105) || (normalized >= 255 && normalized <= 285);
    
    if (isWithinTarget) {
      soundEngine.playLockOn();
      const nextSteps = lockSteps + 1;
      setLockSteps(nextSteps);
      setReticleFeedback('SIGNAL LOCKED');
      setTimeout(() => setReticleFeedback(null), 600);
      if (nextSteps >= 3) {
        triggerSuccess();
      }
    } else {
      soundEngine.playQuizIncorrect();
      setReticleFeedback('OUT OF PHASE');
      setTimeout(() => setReticleFeedback(null), 500);
    }
  };

  // --- Game 4: Viking Soil Scoop Logic ---
  const handleScoopSoil = (index: number) => {
    if (scoopProgress === 'analyzing') return;
    soundEngine.playDustWhisk();
    const updated = [...soilSamples];
    updated[index] = true;
    setSoilSamples(updated);

    if (updated.every(Boolean)) {
      setScoopProgress('analyzing');
      soundEngine.playLockOn();
      setTimeout(() => {
        triggerSuccess();
      }, 700);
    }
  };

  // --- Game 5: Phoenix Ice Trench Drag Logic ---
  const handleTrenchTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDraggingIce(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastTouchYRef.current = clientY;
  };

  const handleTrenchTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingIce || isCompleted) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - lastTouchYRef.current;
    
    if (deltaY > 8) {
      soundEngine.playDustWhisk();
      lastTouchYRef.current = clientY;
      setIceDepth(prev => {
        const next = Math.min(100, prev + 12);
        if (next >= 100) {
          triggerSuccess();
        }
        return next;
      });
    }
  };

  // --- Game 6: Ingenuity Flight Physics Loop ---
  useEffect(() => {
    if (relic.id !== 6 || isCompleted) return;

    const interval = setInterval(() => {
      setAltitude(prev => {
        const targetLift = isLiftingRef.current ? 3.2 : -1.8;
        // Mild atmospheric gust turbulence
        const turbulence = (Math.random() - 0.5) * 1.5;
        const nextAlt = Math.max(0, Math.min(100, prev + targetLift + turbulence));

        // Sweet spot zone: 45% to 75%
        if (nextAlt >= 45 && nextAlt <= 75) {
          setFlightTimeInZone(t => {
            const nextT = t + 0.05;
            if (nextT >= 4.0) {
              triggerSuccess();
            }
            return nextT;
          });
        }
        return nextAlt;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [relic.id, isCompleted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 text-slate-100 shadow-2xl border border-white/15">
        {/* Header with Title and Reset */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
              <span>{relic.mission}</span>
              <span>·</span>
              <span>Year {relic.year}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <span>{relic.icon}</span>
              <span>{relic.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
              title="Reset Puzzle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Puzzle Interactive Container */}
        <div className="min-h-[260px] flex flex-col justify-center">
          {/* Relic 1: Apollo Science Station (ALSEP) */}
          {relic.id === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed text-center">
                Match power cables from the RTG generator to the correct voltage receptors.
                Tap a power cable, then tap the corresponding port on the right.
              </p>

              <div className="grid grid-cols-2 gap-4 py-2">
                {/* Available Cables */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">RTG Connectors</span>
                  {['12V', '28V', '5V'].map(v => {
                    const isUsed = Object.values(cables).includes(v);
                    const isSelected = selectedCable === v;
                    return (
                      <button
                        key={v}
                        disabled={isUsed}
                        onClick={() => {
                          soundEngine.playDustWhisk();
                          setSelectedCable(isSelected ? null : v);
                        }}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-between border transition-all cursor-pointer ${
                          isUsed
                            ? 'opacity-30 border-white/5 bg-white/5 text-slate-500'
                            : isSelected
                            ? 'border-blue-400 bg-blue-500/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-102'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span>{v === '12V' ? '12V Power Line' : v === '28V' ? '28V Transmitter' : '5V Sensor Bus'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">{v}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Target Ports */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">ALSEP Inlets</span>
                  {['12V', '28V', '5V'].map(targetV => {
                    const connected = cables[targetV];
                    const isCorrect = connected === targetV;
                    return (
                      <button
                        key={targetV}
                        onClick={() => handleConnectPort(targetV)}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono flex items-center justify-between border transition-all cursor-pointer ${
                          isCorrect
                            ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                            : connected
                            ? 'border-rose-500/60 bg-rose-500/20 text-rose-300'
                            : selectedCable
                            ? 'border-blue-400/50 bg-blue-500/10 text-slate-200 hover:border-blue-400'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Socket [{targetV}]</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {connected ? `${connected} plugged` : 'OPEN'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Relic 2: Lunar Rover Dust Cleaning */}
          {relic.id === 2 && (
            <div className="space-y-3 text-center">
              <p className="text-xs text-slate-300">
                Abrasive lunar dust has covered the Lunar Rover solar array and antenna.
                Tap rapidly on all dust clusters to brush them off!
              </p>

              <div className="relative w-full h-56 bg-slate-900/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                {/* Stylized Lunar Rover Silhouette */}
                <div className="text-6xl opacity-40 select-none pointer-events-none">
                  🚜
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                  <span className="text-[11px] font-mono text-slate-400">Surface Cleaning Matrix</span>
                  <span className="text-[11px] font-mono text-amber-400">
                    Remaining Dust: {dustPatches.filter(p => !p.cleaned).length} / {dustPatches.length}
                  </span>
                </div>

                {/* Dust Patches */}
                {dustPatches.map(patch => (
                  !patch.cleaned && (
                    <button
                      key={patch.id}
                      onClick={() => handleCleanPatch(patch.id)}
                      style={{
                        left: `${patch.x}%`,
                        top: `${patch.y}%`,
                        width: `${patch.size}px`,
                        height: `${patch.size}px`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-500/70 backdrop-blur-xs border border-stone-300/40 shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer animate-pulse"
                      title="Tap to clean"
                    >
                      <span className="text-[10px] font-mono text-stone-200">DUST</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Relic 3: Surveyor 3 Reticle Alignment */}
          {relic.id === 3 && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Synchronize Surveyor 3 telemetry with Earth ground control.
                Tap the LOCK button when the rotating scanner sweeps through the green arc!
              </p>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-44 h-44 rounded-full border-2 border-white/20 flex items-center justify-center bg-slate-950/40 shadow-inner">
                  {/* Target green tolerance arc (approx 90 deg bottom) */}
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-400/80 border-r-emerald-400/30"></div>
                  
                  {/* Concentric rings */}
                  <div className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-blue-400/40 flex items-center justify-center">
                      <span className="text-sm">📡</span>
                    </div>
                  </div>

                  {/* Rotating beam scanner needle */}
                  <div
                    style={{ transform: `rotate(${alignmentAngle}deg)` }}
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-white origin-center"
                  ></div>

                  {/* Target Crosshairs */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-[1px] bg-white/10"></div>
                    <div className="h-full w-[1px] bg-white/10 absolute"></div>
                  </div>
                </div>

                {/* Feedback message */}
                <div className="h-6 mt-3 font-mono text-xs">
                  {reticleFeedback && (
                    <span className={reticleFeedback === 'SIGNAL LOCKED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {reticleFeedback}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(step => (
                      <div
                        key={step}
                        className={`w-6 h-2 rounded-full transition-colors ${
                          step <= lockSteps ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleReticleTap}
                  className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-mono font-bold text-sm text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-transform cursor-pointer"
                >
                  LOCK FREQUENCY
                </button>
              </div>
            </div>
          )}

          {/* Relic 4: Viking Lander Soil Scoop */}
          {relic.id === 4 && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Deploy Viking 1 robotic sample arm. Tap 3 distinct Martian soil strata to collect samples for the miniature biology laboratory.
              </p>

              <div className="relative w-full h-52 bg-[#1f100a] rounded-xl border border-amber-900/40 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center text-[11px] font-mono text-amber-200/70">
                  <span>GCMS Pyrolysis Chamber</span>
                  <span>Collected: {soilSamples.filter(Boolean).length}/3</span>
                </div>

                {/* Strata excavation zones */}
                <div className="grid grid-cols-3 gap-3 my-auto">
                  {['Surface Regolith', 'Subsurface Trench', 'Mineral Crust'].map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => handleScoopSoil(idx)}
                      disabled={soilSamples[idx]}
                      className={`p-3 rounded-lg border text-xs font-mono flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        soilSamples[idx]
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 opacity-80'
                          : 'border-amber-700/50 bg-[#351912] hover:bg-[#462118] text-amber-100 hover:border-amber-500'
                      }`}
                    >
                      <span className="text-lg">{soilSamples[idx] ? '✓' : '⛏️'}</span>
                      <span className="text-[11px] font-medium leading-tight">{label}</span>
                      <span className="text-[9px] text-amber-300/60">
                        {soilSamples[idx] ? 'ANALYZED' : 'SCOOP SAMPLE'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-mono text-amber-400/80">
                  Chryse Planitia Sample Coordinates: 22.7°N 48.2°W
                </div>
              </div>
            </div>
          )}

          {/* Relic 5: Phoenix Lander Ice Trench */}
          {relic.id === 5 && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Drag downward or swipe repeatedly on the drill scraper to dig through Martian permafrost to expose the buried water-ice layer.
              </p>

              <div
                onMouseDown={handleTrenchTouchStart}
                onMouseMove={handleTrenchTouchMove}
                onMouseUp={() => setIsDraggingIce(false)}
                onTouchStart={handleTrenchTouchStart}
                onTouchMove={handleTrenchTouchMove}
                onTouchEnd={() => setIsDraggingIce(false)}
                className="relative w-full h-52 bg-[#2b140b] rounded-xl border border-red-900/50 p-4 flex flex-col justify-between overflow-hidden cursor-ns-resize select-none"
              >
                {/* Exposed ice visual gradient */}
                <div
                  style={{ height: `${iceDepth}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-200 via-sky-300/80 to-transparent transition-all duration-150 pointer-events-none"
                >
                  <div className="p-3 text-left">
                    <span className="text-[11px] font-mono text-cyan-900 font-bold bg-white/70 px-2 py-0.5 rounded">
                      PURE WATER ICE EXPOSED: {iceDepth}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 z-10">
                  <span>Excavation Depth: {Math.round((iceDepth / 100) * 15)} cm</span>
                  <span className="text-cyan-300">Target: 15 cm</span>
                </div>

                <div className="z-10 my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 animate-bounce">
                    <span className="text-xl">⬇</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 mt-2">
                    {iceDepth === 0 ? 'DRAG DOWN TO SCRAPE TRENCH' : 'KEEP SCRAPING...'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden z-10">
                  <div
                    style={{ width: `${iceDepth}%` }}
                    className="h-full bg-cyan-400 transition-all duration-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Relic 6: Ingenuity Helicopter Altitude Balance */}
          {relic.id === 6 && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Keep Ingenuity stable inside the green altitude corridor (45%–75%) for 4 consecutive seconds against thin Martian winds!
              </p>

              <div className="relative w-full h-52 bg-slate-950/70 rounded-xl border border-white/10 p-3 overflow-hidden flex flex-col justify-between">
                {/* Green Sweet Spot Target Corridor */}
                <div
                  style={{ top: '25%', height: '30%' }}
                  className="absolute left-0 right-0 bg-emerald-500/20 border-y border-emerald-400/40 flex items-center justify-end px-3 pointer-events-none"
                >
                  <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold">Stable Flight Corridor</span>
                </div>

                {/* Ingenuity Helicopter Icon Position */}
                <div
                  style={{ bottom: `${altitude}%` }}
                  className="absolute left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-75 pointer-events-none"
                >
                  <span className="text-2xl animate-spin" style={{ animationDuration: '0.4s' }}>🚁</span>
                  <span className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-white border border-white/20">
                    {Math.round(altitude)}% ALT
                  </span>
                </div>

                {/* Flight time counter bar */}
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 z-10">
                  <span>Martian Air Density: 0.020 kg/m³</span>
                  <span className="text-emerald-400 font-bold">Lock: {flightTimeInZone.toFixed(1)}s / 4.0s</span>
                </div>

                {/* Interactive Lift Controls */}
                <div className="z-10 flex gap-3 mt-auto">
                  <button
                    onMouseDown={() => {
                      isLiftingRef.current = true;
                      soundEngine.playHelicopterRotor();
                    }}
                    onMouseUp={() => { isLiftingRef.current = false; }}
                    onMouseLeave={() => { isLiftingRef.current = false; }}
                    onTouchStart={() => {
                      isLiftingRef.current = true;
                      soundEngine.playHelicopterRotor();
                    }}
                    onTouchEnd={() => { isLiftingRef.current = false; }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg active:scale-98 transition-transform cursor-pointer"
                  >
                    PRESS & HOLD FOR ROTOR LIFT ⬆
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Splash Indicator */}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-950/90 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-emerald-300 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">RELIC RESTORED!</h3>
            <p className="text-sm text-emerald-200 mt-1 font-mono">Telemetry link verified. Logging archive card...</p>
          </div>
        )}
      </div>
    </div>
  );
};
