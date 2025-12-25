
import React, { useState } from 'react';
import { GeneratedPromptResult } from '../types';

interface ResultViewProps {
  result: GeneratedPromptResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.engineeredPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalScore = result.evaluationReport?.totalScore || 0;
  const scorePercentage = (totalScore / 175) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
              className="text-emerald-500 transition-all duration-1000"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * scorePercentage) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{totalScore}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Chain Score</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold text-slate-100">Quality Verified</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            This prompt was processed through the 35-criteria Prompt Evaluation Chain. 
            Refinements were applied to address hallucination boundaries, meta-cognition triggers, and structural logic.
          </p>
          <button 
            onClick={() => setShowFullReport(!showFullReport)}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest mt-2 block"
          >
            {showFullReport ? 'Hide Quality Report' : 'View Quality Report'}
          </button>
        </div>
      </div>

      {showFullReport && result.evaluationReport && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <h5 className="font-bold text-slate-200">Refinement Suggestions Applied:</h5>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.evaluationReport.refinementSuggestions.map((s, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-slate-900/60 rounded-2xl border border-indigo-500/30 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Master Refined Prompt</h3>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-200 transition-colors border border-slate-700"
          >
            {copied ? (
              <><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg> Copy Prompt</>
            )}
          </button>
        </div>
        <div className="p-6">
          <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed select-all selection:bg-indigo-500/30 max-h-[500px] overflow-y-auto">
            {result.engineeredPrompt}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBlock title="Implementation Notes" content={result.implementationNotes} icon="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 2.02a3.323 3.323 0 00-4.588 4.588 3.323 3.323 0 00-2.02 5.618 3.323 3.323 0 005.618 2.02 3.323 3.323 0 004.588-4.588 3.323 3.323 0 002.02-5.618z" />
        <InfoBlock title="Design Choices" content={result.designChoices} icon="M11 4a2 2 0 114 0v1a2 2 0 002 2h3a2 2 0 012 2v3a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v3a2 2 0 01-2 2h-3a2 2 0 00-2 2v1a2 2 0 11-4 0v-1a2 2 0 00-2-2H7a2 2 0 01-2-2v-3a2 2 0 00-2-2H4a2 2 0 110-4h1a2 2 0 002-2V7a2 2 0 012-2h3a2 2 0 002-2V4z" />
        <InfoBlock title="Usage Guidelines" content={result.usageGuidelines} icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        <InfoBlock title="Expected Performance" content={result.expectedOutputs} icon="M13 10V3L4 14h7v7l9-11h-7z" />
      </div>
    </div>
  );
};

const InfoBlock = ({ title, content, icon }: { title: string, content: string, icon: string }) => (
  <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
    <h4 className="text-indigo-300 font-bold mb-3 flex items-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
      {title}
    </h4>
    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
      {content}
    </p>
  </div>
);

export default ResultView;
