const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { scrapeDistrictPortal, scrapeUniversityBoard } = require('./scraper');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = 5000;

// --- CONFIG: Gemini AI Setup ---
const GEN_AI_KEY = "AIzaSyCuVmJQUcLrJzeRluBeuanoBQkTJXTUJnI"; 
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- ROUTE 1: Get Scraped Jobs (Layer 1) ---
app.get('/api/jobs', (req, res) => {
    console.log("📥 Fetching local cached data...");
    const districtJobs = scrapeDistrictPortal();
    const uniJobs = scrapeUniversityBoard();
    const allJobs = [...districtJobs, ...uniJobs];

    res.json({
        success: true,
        data: allJobs
    });
});

// --- ROUTE 2: Verification (Layer 2) ---
app.post('/api/verify-job', async (req, res) => {
    // ... (Keep your existing verification logic here) ...
});

// --- ROUTE 3: AI FALLBACK SEARCH (Layer 3 - NEW!) ---
app.post('/api/ai-search', async (req, res) => {
    const { query } = req.body;
    console.log(`🔎 AI Searching for: ${query}...`);

    try {
        const prompt = `
        User is searching for a job role or company: "${query}".
        Our local database has NO results. 
        
        Please act as a Career Intelligence Agent and provide:
        1. A brief summary of what this role typically involves or what the company does.
        2. The typical salary range in India for this role.
        3. Required skills.
        4. A "Market Status" (e.g., High Demand, Stable, Niche).

        Respond ONLY in this JSON format:
        {
            "summary": "...",
            "salary_range": "...",
            "skills": ["skill1", "skill2"],
            "market_status": "..."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '');
        
        res.json({ success: true, data: JSON.parse(cleanJson) });

    } catch (error) {
        console.error("AI Search Error:", error);
        res.json({ success: false, message: "AI Search unavailable." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});