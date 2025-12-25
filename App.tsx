
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PromptForm from './components/PromptForm';
import ResultView from './components/ResultView';
import { PromptRequest, GeneratedPromptResult } from './types';
import { architectDraft, evaluateDraft, refinePrompt } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<GeneratedPromptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async (request: PromptRequest) => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Step 1: Initial Architecture
      setStatusText('Architecting initial draft structure...');
      setProgress(10);
      const { draftPrompt } = await architectDraft(request);
      
      // Step 2: Evaluation Chain
      setProgress(30);
      setStatusText('Running 35-criteria Evaluation Chain...');
      const report = await evaluateDraft(draftPrompt);
      
      // Step 3: Refinement Chain
      setProgress(60);
      setStatusText('Processing Refinement Chain & feedback loops...');
      const finalResult = await refinePrompt(draftPrompt, report);
      
      // Finalize
      setProgress(100);
      setStatusText('Finalizing the ultimate prompt...');
      setTimeout(() => {
        setResult(finalResult);
        setIsLoading(false);
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during the engineering chain.');
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            PromptArchitect Pro
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            The world's most advanced prompt optimization engine. 
            Drafting, evaluating across 35 criteria, and refining until perfection.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-12">
          {!isLoading && !result && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-sm">1</span>
                Define Your Objective
              </h3>
              <PromptForm onSubmit={handlePromptSubmit} isLoading={isLoading} />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
              <button onClick={() => setIsLoading(false)} className="ml-auto underline">Try again</button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-full max-w-md bg-slate-900 h-4 rounded-full border border-slate-800 overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-3">
                  <span className="tabular-nums">{progress}%</span>
                  <span className="text-slate-500 text-sm font-normal">|</span>
                  <span className="text-indigo-400 text-lg uppercase tracking-wider">{statusText}</span>
                </div>
                <p className="text-slate-500 text-sm animate-pulse italic">
                  Running recursive neural refinement logic...
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm opacity-50">
                 {[1,2,3].map(i => (
                   <div key={i} className={`h-1 rounded-full ${progress >= (i*33) ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                 ))}
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm">2</span>
                  Refined System Prompt
                </h3>
                <button 
                  onClick={() => { setResult(null); setProgress(0); }}
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  Start New Session
                </button>
              </div>
              <ResultView result={result} />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default App;
