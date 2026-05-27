import { db } from "../../lib/db";
import { createOllama } from "ollama-ai-provider";
import { streamText, type LanguageModel } from "ai";

// Initialize the provider
const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

// Create the model instance and cast to LanguageModelV1 to fix the type error
const model = ollama("qwen2.5-coder:7b-instruct-q8_0") as LanguageModel;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages[messages.length - 1]?.content || "";

  const systemPrompt = `
    You are an expert health assistant and tracking coach. 
    Analyze the user's input and accurately extract data points if present.
    
    Categories must strictly be one of: "WEIGHT", "MEAL", "BP", or "GENERAL".
    - If they mention weight (e.g., "91.8kg"), extract it as a float.
    - If they log food, estimate the calories or extract them if provided.
    - If they provide blood pressure (e.g., "120/80"), extract systolic (120) and diastolic (80).
    
    Respond naturally to the user as a supportive coach, but remember that your data extractions are being saved to a permanent local database.
  `;

  let category = "GENERAL";
  let weight: number | null = null;
  let systolic: number | null = null;
  let diastolic: number | null = null;
  const calories: number | null = null; 

  // Basic regex parser
  const weightMatch = latestMessage.match(/(\d+(\.\d+)?)\s*kg/i);
  if (weightMatch) {
    weight = parseFloat(weightMatch[1]);
    category = "WEIGHT";
  }

  const bpMatch = latestMessage.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (bpMatch) {
    systolic = parseInt(bpMatch[1], 10);
    diastolic = parseInt(bpMatch[2], 10);
    category = "BP";
  }

  if (latestMessage.toLowerCase().includes("ate") || latestMessage.toLowerCase().includes("food")) {
    category = "MEAL";
  }

  const result = await streamText({
    model: model,
    system: systemPrompt,
    messages,
    onFinish: async (event) => {
      await db.healthLog.create({
        data: {
          rawInput: latestMessage,
          category,
          weight,
          systolic,
          diastolic,
          calories,
          analysis: event.text,
        },
      });
    },
  });

  return result.toAIStreamResponse(); 
}