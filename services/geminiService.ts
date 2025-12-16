import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyPhotocard = async (base64Image: string): Promise<ScanResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `你是一位擁有鷹眼的資深 K-Pop 小卡鑑定專家。請極度仔細地分析這張圖片中的人物特徵。
            
            ⚠️ 特別指令：用戶目前專注於收藏 **BOYNEXTDOOR (BND)** 的小卡。請優先比對成員：SUNGHO (成淏), RIWOO (里優), JAEHYUN (宰賢), TAESAN (泰山), LEEHAN (李漢), WOONHAK (雲鶴)。
            
            ⚠️ 為了避免認錯人，請先觀察並分析以下特徵：
            1. 五官細節：眼睛形狀（單/雙眼皮、眼尾）、淚痣位置、鼻子與嘴巴線條。
            2. 髮型與髮色：比對該團體不同時期的回歸造型 (如 WHO!, WHY.., HOW? 等時期)。
            3. 穿搭與背景：確認是否為特定的打歌服、MV 造型或專輯概念照。

            識別這位偶像的名字、所屬團體、以及這張卡片可能的來源（例如：專輯名稱、特典、廣播卡等）。
            
            此外，請根據市場行情提供一個「粗略的估價範圍」，幣值請使用台幣 (TWD) 或美金 (USD)。
            請判定稀有度（例如：普卡、特典、稀有廣播卡）。

            請用繁體中文 (Traditional Chinese) 回傳 JSON 格式結果。`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idolName: { type: Type.STRING, description: "偶像名字 (中文/韓文/英文)" },
            groupName: { type: Type.STRING, description: "團體名稱" },
            albumOrEra: { type: Type.STRING, description: "專輯、時期或活動名稱" },
            estimatedPrice: { type: Type.STRING, description: "估價範圍 (例如: '$150 - $300 TWD')" },
            rarity: { type: Type.STRING, description: "稀有度描述 (例如: '專輯普卡', '線下簽售特典')" },
          },
          required: ["idolName", "groupName", "albumOrEra", "estimatedPrice", "rarity"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ScanResult;
    } else {
      throw new Error("No text returned from Gemini");
    }
  } catch (error) {
    console.error("Error identifying photocard:", error);
    throw error;
  }
};