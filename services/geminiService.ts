
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ResumeData } from "../types";
import { GEMINI_API_KEY_ERROR_MESSAGE, GEMINI_GENERAL_ERROR_MESSAGE } from '../constants';


const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error(GEMINI_API_KEY_ERROR_MESSAGE);
    throw new Error(GEMINI_API_KEY_ERROR_MESSAGE);
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = getApiKey();
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

const callGemini = async (prompt: string): Promise<string> => {
  try {
    const genAI = getAIInstance();
    const response: GenerateContentResponse = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Check for specific API key related errors if possible from the error object structure
    // For now, rethrow a general error or specific if identifiable
    throw new Error(GEMINI_GENERAL_ERROR_MESSAGE);
  }
};


export const generateResumeContent = async (promptDetails: string, resumeContext: ResumeData): Promise<string> => {
  const prompt = `
    You are an expert resume writer.
    Current resume context (JSON format, use this for context and style if needed):
    ${JSON.stringify(resumeContext, null, 2)}

    Task: ${promptDetails}
    
    Provide only the requested content. If generating bullet points, provide each on a new line.
    Be concise, professional, and use action verbs.
  `;
  return callGemini(prompt);
};

export const getKeywordsSuggestion = async (resumeText: string, industry: string, role: string): Promise<string> => {
  const prompt = `
    Analyze the following resume text for a ${role} in the ${industry} industry:
    ---
    ${resumeText}
    ---
    Suggest 5-10 highly relevant industry-specific keywords and action verbs that could be incorporated to enhance this resume for Applicant Tracking Systems (ATS) and human recruiters.
    Present them as a comma-separated list or bullet points.
    Also, provide a brief (1-2 sentences) explanation of why these keywords are important for this role/industry.
  `;
  return callGemini(prompt);
};

export const getATSAdvice = async (industry: string, role: string): Promise<string> => {
  const prompt = `
    Provide actionable advice on making a resume ATS-friendly for a ${role} in the ${industry} industry. 
    Cover key areas such as:
    - Formatting (fonts, layout, file type)
    - Keyword usage and placement
    - Section headings
    - Common mistakes to avoid
    Present the advice in clear, easy-to-understand bullet points.
  `;
  return callGemini(prompt);
};

export const getJobMatchAnalysis = async (resumeText: string, jobDescription: string): Promise<string> => {
  const prompt = `
    You are an expert career advisor. Analyze the following resume and job description.
    
    Resume:
    ---
    ${resumeText}
    ---

    Job Description:
    ---
    ${jobDescription}
    ---

    Provide a detailed analysis including:
    1. Key Strengths: How well the resume matches the key requirements of the job description. Highlight specific skills and experiences from the resume that align.
    2. Potential Gaps: Identify any key requirements from the job description that are not clearly addressed in the resume.
    3. Suggestions for Improvement: Offer 2-3 specific, actionable suggestions on how the resume could be tailored to better match this job description (e.g., rephrasing bullet points, highlighting specific projects/skills, adding missing keywords found in the JD).
    4. Overall Match Score (Qualitative): Briefly state if it's a Strong, Moderate, or Weak match, with a one-sentence justification.

    Format the response clearly with headings for each section.
  `;
  return callGemini(prompt);
};
