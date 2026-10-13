require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  
  for (const m of modelsToTry) {
    try {
      console.log(`Trying model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const prompt = `Return JSON for 2026 movie "Drishyam The Conclusion": {"title": "Drishyam The Conclusion", "rating": 8.8, "year": 2026}. Raw JSON only.`;
      const result = await model.generateContent(prompt);
      console.log(`✅ Success with ${m}:\n`, result.response.text());
      return;
    } catch (err) {
      console.warn(`⚠️ Failed with ${m}: ${err.message}`);
    }
  }
}

test().catch(console.error);
