
import { GoogleGenAI, Type } from "@google/genai";
import { NoteCategory, VoiceNote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processVoiceAudio = async (audioBase64: string): Promise<Partial<VoiceNote>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'audio/webm',
            data: audioBase64
          }
        },
        {
          text: `အောက်ပါ အသံမှတ်တမ်းကို မြန်မာစကားမှ မြန်မာစာသားသို့ တိကျစွာ ပြောင်းလဲပေးပါ။
          အရေးကြီးသော ညွှန်ကြားချက်များ:
          ၁။ ပြောဆိုသူ၏ အသံအကြမ်း (Rough speech) ကို ပရော်ဖက်ရှင်နယ် ဆန်သော ရုံးသုံးစာသား (Professional/Formal writing) အဖြစ် ပြောင်းလဲရေးသားပေးပါ။
          ၂။ သဒ္ဒါနှင့် စာလုံးပေါင်းများကို မြန်မာစာစံနှုန်းအတိုင်း ပြင်ဆင်ပါ။
          ၃။ မှတ်စု၏ အကြောင်းအရာကို လိုက်၍ အမျိုးအစား ခွဲခြားပါ။
          
          ပြန်လည်ဖြေကြားရမည့် JSON Format:
          {
            "originalText": "မူရင်းစကားပြောအတိုင်း စာသား",
            "enhancedText": "ပရော်ဖက်ရှင်နယ် ပြုပြင်ပြီး စာသား (အဓိပ္ပာယ် မပြောင်းလဲစေရ)",
            "category": "အလုပ်/ကိုယ်ရေးကိုယ်တာ/သတ္တုတူးဖော်ရေး/ဘဏ္ဍာရေး/စိတ်ကူးများ/နေ့စဉ်မှတ်တမ်း အနက်မှ အသင့်တော်ဆုံးတစ်ခု",
            "summary": "မှတ်စု၏ အနှစ်ချုပ် (စာကြောင်းတစ်ကြောင်း)",
            "isUrgent": true/false (ချက်ချင်းဆောင်ရွက်ရန် လိုအပ်ပါက true ပေးရန်),
            "keywords": ["အဓိကစကားလုံး ၁", "၂", "၃"]
          }`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          enhancedText: { type: Type.STRING },
          category: { type: Type.STRING },
          summary: { type: Type.STRING },
          isUrgent: { type: Type.BOOLEAN },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  try {
    const jsonStr = response.text?.trim() || '{}';
    const result = JSON.parse(jsonStr);
    return {
      ...result,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("AI မှ မှတ်စုကို အကျဉ်းချုပ်ရန် ပျက်ကွက်ခဲ့ပါသည်။");
  }
};

export const generateNoteReport = async (notes: VoiceNote[], type: 'daily' | 'weekly' | 'monthly') => {
  const context = notes.map(n => `- [${new Date(n.timestamp).toLocaleDateString()}] [${n.category}]: ${n.enhancedText}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `အောက်ပါ မှတ်စုများကို အခြေခံ၍ ${type === 'daily' ? 'နေ့စဉ်' : type === 'weekly' ? 'အပတ်စဉ်' : 'လစဉ်'} အစီရင်ခံစာ ထုတ်ပေးပါ။
    
    မှတ်စုများစာရင်း:
    ${context}

    အောက်ပါ JSON format ဖြင့် မြန်မာလိုသာ ဖြေကြားပေးပါ:
    {
      "totalNotes": စုစုပေါင်းမှတ်စုအရေအတွက်,
      "summary": "အစီရင်ခံစာ အကျဉ်းချုပ် (အနှစ်ချုပ် သုံးသပ်ချက်)",
      "keyTopics": ["အဓိကအကြောင်းအရာ ၁", "၂"],
      "insights": ["မှတ်စုများမှ တွေ့ရှိချက် ၁", "၂"],
      "actionRecommendations": ["လုပ်ဆောင်ရန် အကြံပြုချက် ၁", "၂"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalNotes: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text?.trim() || '{}');
  } catch (e) {
    console.error("Failed to parse report response", e);
    throw new Error("အစီရင်ခံစာ ထုတ်ယူရန် ပျက်ကွက်ခဲ့ပါသည်။");
  }
};
