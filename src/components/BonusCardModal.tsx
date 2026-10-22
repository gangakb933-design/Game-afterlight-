import React from 'react';
import { BonusCard } from '../types/game';
import { Sparkles, X, CheckCircle, Lock } from 'lucide-react';

interface BonusCardModalProps {
  bonusCards: BonusCard[];
  onClose: () => void;
}

export const BonusCardModal: React.FC<BonusCardModalProps> = ({ bonusCards, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 text-slate-100 shadow-2xl border border-white/20 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Secret Historical Archives
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-2 mb-4">
          Uncover glowing surface anomalies hidden across lunar and Martian plains to unlock classified NASA preservation records.
        </p>

        {/* Cards Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {bonusCards.map((card, idx) => (
            <div
              key={card.id}
              className={`p-3.5 rounded-xl border transition-all ${
                card.collected
                  ? 'border-amber-400/40 bg-amber-950/20 text-slate-100'
                  : 'border-white/5 bg-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className={card.collected ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  Chapter {card.chapter}: {card.location}
                </span>
                <span className="flex items-center gap-1">
                  {card.collected ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>DISCOVERED</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white">
                {card.collected ? card.name : `Secret Archive Item #0${idx + 1}`}
              </h4>

              {card.collected ? (
                <>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {card.fact}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-amber-300/80">
                    Historical Log: {card.date}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-500 italic mt-1 font-mono">
                  Search the planet surface for subtle shimmering golden ground sparkles...
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-medium text-slate-300 transition-colors cursor-pointer"
        >
          Close Archive Viewer
        </button>
      </div>
    </div>
  );
};
