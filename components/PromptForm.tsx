
import React, { useState } from 'react';
import { PromptRequest, ModelTarget, Technique } from '../types';

interface PromptFormProps {
  onSubmit: (request: PromptRequest) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [targetModel, setTargetModel] = useState<ModelTarget>(ModelTarget.GENERIC);
  const [selectedTechniques, setSelectedTechniques] = useState<Technique[]>([]);

  const toggleTechnique = (tech: Technique) => {
    setSelectedTechniques(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;
    onSubmit({ intent, context, targetModel, techniques: selectedTechniques });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <label className="block text-sm font-medium mb-2 text-indigo-300">Goal / Objective</label>
        <input
          type="text"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="e.g., Create a creative writing assistant for sci-fi authors"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-indigo-300">Context / Draft (Optional)</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Paste your existing draft prompt or detailed requirements here..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-indigo-300">Target Architecture</label>
          <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value as ModelTarget)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {Object.values(ModelTarget).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-indigo-300">Prompting Techniques</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Technique).map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTechnique(tech)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedTechniques.includes(tech)
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !intent.trim()}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Engineering Prompt...
          </>
        ) : (
          'Architect System Prompt'
        )}
      </button>
    </form>
  );
};

export default PromptForm;
