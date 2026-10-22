import React, { useState } from 'react';
import { Relic } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { ExternalLink, CheckCircle, AlertCircle, ArrowRight, Award } from 'lucide-react';

interface FactCardModalProps {
  relic: Relic;
  onContinue: () => void;
}

export const FactCardModal: React.FC<FactCardModalProps> = ({ relic, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === relic.quiz.correctIndex) {
      soundEngine.playQuizCorrect();
    } else {
      soundEngine.playQuizIncorrect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 text-slate-100 shadow-2xl border border-white/20 my-auto">
        {/* Banner with Stamp */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Recovery Verified · NASA Archive Entry
            </span>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>AUTHENTICATED</span>
          </div>
        </div>

        {/* Polaroid Style Photo Container */}
        <div className="bg-slate-100 p-3 pt-3 pb-5 rounded-lg shadow-xl text-slate-900 my-4 transform rotate-[-0.5deg]">
          {/* Photo Frame */}
          <div className="relative w-full h-44 bg-gradient-to-br from-slate-900 to-slate-800 rounded overflow-hidden flex flex-col justify-between p-3 text-white">
            {/* Mission stamp overlay */}
            <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
              <span className="bg-black/60 px-2 py-0.5 rounded">{relic.coordinates}</span>
              <span className="bg-blue-600/80 px-2 py-0.5 rounded">{relic.mission}</span>
            </div>

            {/* Stylized Center Graphic */}
            <div className="flex flex-col items-center justify-center my-auto">
              <span className="text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-1">
                {relic.icon}
              </span>
              <span className="text-xs font-bold font-mono tracking-wide uppercase text-blue-200">
                {relic.name}
              </span>
            </div>

            <div className="text-[10px] font-mono opacity-70 text-right">
              Archive Log: {relic.year}
            </div>
          </div>

          {/* Polaroid Handwritten Caption Style */}
          <div className="pt-2 text-center">
            <p className="text-xs font-mono font-bold tracking-tight text-slate-800">
              {relic.name} — {relic.subtitle}
            </p>
          </div>
        </div>

        {/* Historical Facts Section */}
        <div className="space-y-2 mb-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
            <span>NASA Mission Field Notes</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-200 leading-relaxed list-disc list-inside">
            {relic.facts.map((fact, idx) => (
              <li key={idx} className="pl-1">
                {fact}
              </li>
            ))}
          </ul>
          <div className="pt-1 flex justify-end">
            <a
              href={relic.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              <span>Source: Official NASA Archives</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Quiz Section */}
        <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase text-blue-300 font-bold">
              Field Telemetry Quiz
            </span>
          </div>
          <p className="text-xs font-semibold text-white mb-2.5">
            {relic.quiz.question}
          </p>

          <div className="space-y-1.5">
            {relic.quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === relic.quiz.correctIndex;
              let btnClass = 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200';

              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-500/20 text-rose-200';
                } else {
                  btnClass = 'border-white/5 bg-white/5 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full py-2 px-3 rounded-lg text-xs text-left border flex items-center justify-between transition-all cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="mt-2.5 pt-2 border-t border-blue-400/20 text-[11px] text-blue-200 leading-relaxed font-mono">
              <span className="font-bold">{selectedOption === relic.quiz.correctIndex ? 'Correct! ' : 'Notice: '}</span>
              {relic.quiz.explanation}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-mono font-bold text-sm text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <span>Continue Surface Exploration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
