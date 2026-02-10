import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import dotenv from 'dotenv';

// --- 1. SETUP (Was missing in your snippet) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const EN_DIR = path.join(__dirname, '../messages/en');
const ZH_DIR = path.join(__dirname, '../messages/zh');

const FORCE_SYNC = true; 

const GLOSSARY = {
  "Vinyasa": "流瑜伽",
  "Workshop": "工作坊",
  "1-on-1": "1对1私教",
  "Healing": "理疗修复",
  "Transformation": "蜕变"
};

// --- 2. THE TRANSLATION LOGIC ---
async function translateJSON(enData, existingZhData = {}) {
  const glossaryString = Object.entries(GLOSSARY).map(([k, v]) => `${k}: ${v}`).join(', ');

  const prompt = `
    You are a professional content creator for "XiaoHongShu" (Little Red Book) specializing in luxury Yoga and wellness in Chiang Mai.
    
    TONE & STYLE:
    1. SOCIAL MEDIA "SEEDING" (种草): Use catchy, emotional, and persuasive language. 
    2. KEYWORDS: Use terms like "宝藏老师", "蜕变", "身心合一", and "避雷/告别".
    3. CONTRAST: Emphasize "precision private practice" (精准私教) over group classes.
    4. FORMATTING: Use full-width Chinese punctuation. Add relevant emojis (🧘‍♂️, ✨, 🌿).
    
    GLOSSARY: ${glossaryString}

    TASK:
    - Translate the English JSON to this "RED" style Simplified Chinese.
    - Merge with existingZhData: keep manual high-quality translations if they exist.
    - Return ONLY the final localized JSON.
  `;

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a social media localization expert. Output valid JSON only." },
        { role: "user", content: `${prompt}\n\nEnglish JSON: ${JSON.stringify(enData)}\n\nExisting Chinese: ${JSON.stringify(existingZhData)}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5 
    }, {
      headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` }
    });

    // ADDED: Better parsing logic
    const content = response.data.choices[0].message.content;
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
}

// --- 3. THE SYNC LOGIC ---
async function sync() {
  // ADDED: Ensure output directory exists
  if (!fs.existsSync(ZH_DIR)) fs.mkdirSync(ZH_DIR, { recursive: true });

  const files = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log("⚠️ No JSON files found in /en directory.");
    return;
  }

  for (const file of files) {
    const enPath = path.join(EN_DIR, file);
    const zhPath = path.join(ZH_DIR, file);

    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    const existingZh = fs.existsSync(zhPath) ? JSON.parse(fs.readFileSync(zhPath, 'utf-8')) : {};

    const enStats = fs.statSync(enPath);
    const zhStats = fs.existsSync(zhPath) ? fs.statSync(zhPath) : { mtime: new Date(0) };

    if (FORCE_SYNC || enStats.mtime > zhStats.mtime) {
      console.log(`✨ Localizing ${file} with "RED" style...`);
      const localized = await translateJSON(enContent, existingZh);

      if (localized) {
        fs.writeFileSync(zhPath, JSON.stringify(localized, null, 2));
        console.log(`✅ ${file} updated.`);
      }
    } else {
      console.log(`- ${file} is up to date.`);
    }
  }
}

// --- 4. THE EXECUTION (Crucial: This actually starts the script) ---
sync().then(() => {
  console.log("✨ All files processed.");
}).catch(err => {
  console.error("💥 Critical Script Error:", err);
});