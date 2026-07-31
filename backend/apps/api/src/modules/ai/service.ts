import axios from "axios";
import { config } from "@vizagops/config";
import { logger } from "@vizagops/logger";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.3-70b-versatile";

export interface AISummaryRequest {
  title: string;
  description: string;
  category?: string;
  ward?: string;
}

export interface AIPrioritizationRequest {
  complaintTitle: string;
  complaintDescription: string;
  category: string;
  nearbySensorEvents?: Array<{ type: string; severity: string }>;
}

export const generateComplaintSummary = async (data: AISummaryRequest) => {
  const prompt = `You are an AI assistant for the Visakhapatnam City Operations Center (GVMC).
Summarize the following citizen complaint concisely for emergency dispatch officers:

Title: ${data.title}
Description: ${data.description}
Category: ${data.category || 'General'}
Ward: ${data.ward || 'Zone Pilot'}

Output JSON in the following exact format:
{
  "executiveSummary": "Short 1-2 sentence summary of the issue",
  "urgencyLevel": "HIGH" | "MEDIUM" | "LOW",
  "recommendedAction": "Actionable step for field crew",
  "keyKeywords": ["keyword1", "keyword2"]
}`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You respond strictly in valid JSON format." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${config.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq AI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    logger.error("Failed to generate AI summary via Groq", { error: error.response?.data || error.message });
    // Fallback response if API fails
    return {
      executiveSummary: `${data.title}: ${data.description.slice(0, 100)}...`,
      urgencyLevel: "MEDIUM",
      recommendedAction: "Dispatch nearest available field team for inspection.",
      keyKeywords: [data.category || "civic", "issue"],
      fallback: true,
    };
  }
};

export const calculateAIPriority = async (data: AIPrioritizationRequest) => {
  const prompt = `Analyze this civic complaint context and calculate an AI Priority score (1 to 10):

Complaint Title: ${data.complaintTitle}
Description: ${data.complaintDescription}
Category: ${data.category}
Nearby Sensors: ${JSON.stringify(data.nearbySensorEvents || [])}

Output JSON in this exact format:
{
  "aiPriorityScore": number (1-10),
  "priorityLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "reasoning": "Explanation for the score based on safety risk, infrastructure impact, or sensor correlation",
  "estimatedResolutionHours": number
}`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You respond strictly in valid JSON format." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${config.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq AI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    logger.error("Failed to calculate AI priority via Groq", { error: error.message });
    return {
      aiPriorityScore: 5,
      priorityLevel: "MEDIUM",
      reasoning: "Rule-based fallback priority calculation.",
      estimatedResolutionHours: 24,
      fallback: true,
    };
  }
};
