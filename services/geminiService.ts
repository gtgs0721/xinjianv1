
import { GoogleGenAI, Type } from "@google/genai";
import { Inspiration } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeInspiration = async (text: string) => {
  if (!apiKey) {
    // Mock response if no API key
    return {
      mood: 'peaceful',
      imagery: ['风', '云'],
      tags: ['静谧', '思考']
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `分析以下文本的情绪基调（mood）和自然意象（imagery，如风、花、雪、月）。
      文本: "${text}"
      返回一个JSON，包含 mood (只能是: peaceful, melancholic, joyful, anxious, neutral 之一), imagery (字符串数组, 中文), 和 tags (字符串数组, 抽象关键词, 中文).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            imagery: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return { mood: 'neutral', imagery: [], tags: [] };
  }
};

export const expandInspiration = async (text: string) => {
  if (!apiKey) return "月影沉入水底，静谧而深邃。 (模拟扩写)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `请将这段灵感扩写成一段简短、充满中国古典美学意境的散文诗。保持空灵、雅致。
      文本: "${text}"`,
    });
    return response.text;
  } catch (error) {
    return "暂时无法进行扩写。";
  }
};

export const getVisualPrompt = async (text: string) => {
    if(!apiKey) return "A traditional chinese ink painting of the concept.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Describe a traditional Chinese ink wash painting that represents this text: "${text}". Keep it brief.`,
        });
        return response.text;
    } catch (e) {
        return "Ink wash painting.";
    }
}

export const generateConnections = async (inspirations: Inspiration[]) => {
  if (!apiKey) {
    return [
      "雨落无声",
      "光影斑驳",
      "随风而逝的记忆"
    ];
  }

  const contentSummary = inspirations.map(i => i.content).join(" | ");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `这里有一些充满诗意的灵感片段: "${contentSummary}"。
      请生成 3 个 新的、简短的、充满创造力的概念，用来连接这些想法，或者探索它们之间的“留白”。
      要求：中文，富有诗意，简短（10字以内）。
      返回 JSON 字符串数组。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Brainstorming failed", error);
    return ["思维的桥梁", "往日的回响"];
  }
}
