
export enum ModelTarget {
  CLAUDE = 'Claude (HHH Focused)',
  GPT = 'GPT (Structured & Clear)',
  GEMINI = 'Gemini (Multimodal & Nuanced)',
  OPEN_SOURCE = 'Open Source (Specific Formats)',
  GENERIC = 'Generic/Universal'
}

export enum Technique {
  FEW_SHOT = 'Few-Shot Learning',
  CHAIN_OF_THOUGHT = 'Chain of Thought',
  ROLE_PLAYING = 'Expert Role-Playing',
  XML_TAGGING = 'XML Structuring',
  STEP_BY_STEP = 'Step-by-Step Reasoning',
  CONSTITUTIONAL = 'Constitutional Guidelines'
}

export interface PromptRequest {
  intent: string;
  context?: string;
  targetModel: ModelTarget;
  techniques: Technique[];
}

export interface EvaluationReport {
  criteriaScores: { [key: string]: { score: number; strength: string; improvement: string; rationale: string } };
  totalScore: number;
  refinementSuggestions: string[];
}

export interface GeneratedPromptResult {
  engineeredPrompt: string;
  implementationNotes: string;
  designChoices: string;
  usageGuidelines: string;
  expectedOutputs: string;
  evaluationReport?: EvaluationReport;
}
