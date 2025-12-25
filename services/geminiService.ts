
import { GoogleGenAI, Type } from "@google/genai";
import { MODEL_NAME, ARCHITECT_SYSTEM_INSTRUCTION, EVALUATOR_SYSTEM_INSTRUCTION, REFINER_SYSTEM_INSTRUCTION } from "../constants";
import { PromptRequest, GeneratedPromptResult, EvaluationReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const architectDraft = async (request: PromptRequest): Promise<{ draftPrompt: string; initialNotes: string }> => {
  const prompt = `Intent: ${request.intent}\nContext: ${request.context || 'None'}\nModel: ${request.targetModel}\nTechniques: ${request.techniques.join(', ')}`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text);
};

export const evaluateDraft = async (draft: string): Promise<EvaluationReport> => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Evaluate this prompt:\n\n${draft}`,
    config: {
      systemInstruction: EVALUATOR_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text);
};

export const refinePrompt = async (draft: string, report: EvaluationReport): Promise<GeneratedPromptResult> => {
  const contents = `Original Draft:\n${draft}\n\nEvaluation Report:\n${JSON.stringify(report, null, 2)}`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents,
    config: {
      systemInstruction: REFINER_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });
  const result = JSON.parse(response.text);
  return { ...result, evaluationReport: report };
};
