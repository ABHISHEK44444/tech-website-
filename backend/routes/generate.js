
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log("➡️ Generation Request Received");
  const { topic, category, tone } = req.body;

  // Safe access to API Key
  const rawKey = process.env.API_KEY;
  const apiKey = (rawKey || "").trim();
  const platform = process.env.RENDER ? 'Render' : 'Vercel/Local';

  // Check for API Key presence
  if (!apiKey) {
    console.error("❌ ERROR: Generation failed. API_KEY is missing in backend environment.");
    return res.status(500).json({ 
      message: "CONFIGURATION ERROR: API_KEY is missing.",
      details: `Platform: ${platform}\nThe backend server checked 'process.env.API_KEY' and found nothing. Go to your Cloud Dashboard (Render/Vercel) > Environment > Add 'API_KEY'.`,
      platform: platform
    });
  }

  let GoogleGenAI, Type;

  try {
    // 1. Try Dynamic Import (ESM)
    const genaiModule = await import("@google/genai");
    GoogleGenAI = genaiModule.GoogleGenAI;
    Type = genaiModule.Type;
  } catch (esmErr) {
    console.warn("⚠️ ESM Import failed, trying CommonJS require...", esmErr.message);
    try {
      // 2. Fallback to CommonJS Require
      const genaiModule = require("@google/genai");
      GoogleGenAI = genaiModule.GoogleGenAI;
      Type = genaiModule.Type;
    } catch (cjsErr) {
      console.error("❌ CRITICAL: @google/genai dependency missing.", cjsErr);
      return res.status(500).json({ 
        message: "Backend dependency missing", 
        error: `Failed to load @google/genai.`,
        details: "The server cannot find the AI library. If running locally, run 'npm install' in the backend folder. If on Render, clear build cache and redeploy."
      });
    }
  }

  // Initialize Gemini API Client
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  // Define category-specific high CPC instructions
  let categoryInstructions = "";
  if (category === 'Cybersecurity') {
    categoryInstructions = `
    SPECIFIC INSTRUCTIONS FOR CYBERSECURITY:
    - Target high CPC B2B keywords: "Endpoint Security", "Cloud Firewalls", "VAPT Services India", "Data Loss Prevention (DLP)", "Zero Trust Architecture", "Ransomware Protection".
    - Focus on enterprise-grade solutions and protection strategies for Indian SMEs and corporations.
    `;
  } else if (category === 'Startups & Business Tech') {
    categoryInstructions = `
    SPECIFIC INSTRUCTIONS FOR STARTUPS & BUSINESS TECH:
    - Target high CPC keywords: "Best CRM Software India", "ERP System Implementation", "Cloud Hosting for Startups", "Payment Gateway Integration", "SaaS Business Models", "Venture Capital India".
    - Mention localized business tools and success stories involving companies like Zoho, Freshworks, Razorpay.
    `;
  }

  // FINAL High-Power AI Studio Prompt adapted for STRUCTURED JSON output
  const prompt = `
    You are an expert SEO writer, Google AdSense specialist, and Indian Tech News Editor.
    
    Topic: ${topic}
    Category: ${category}
    Tone: ${tone}

    GOAL:
    Create a blog post that is fully monetizable under Google AdSense policies, helpful, original, and written for an Indian audience (Indian English).

    SEO REQUIREMENTS:
    1. Focus on High CPC keywords for India (e.g., Hosting, Trading, Software, AI).
    ${categoryInstructions}
    2. INDIAN CONTEXT IS MANDATORY: Use ₹ (INR), mention UPI, Jio, Flipkart, Amazon.in, and local examples.
    3. NO generic AI fluff. Write like a human journalist.

    The output must be broken down into logical sections to allow for a 'Block Editor' experience.

    Return the response as a JSON object with this exact structure:
    {
      "title": "High CTR Title (Max 65 chars)",
      "excerpt": "Meta description style (Max 160 chars)",
      "author": "TechFlow Team",
      "tags": ["Tag1", "Tag2"],
      "introduction": "Strong Hook Intro paragraph (Markdown supported)",
      "sections": [
        { "heading": "H2 Heading", "content": "Paragraph content (Markdown supported, bullet points allowed)" }
      ],
      "conclusion": "Key takeaways or final verdict paragraph",
      "faqs": [
        { "question": "Question string", "answer": "Short concise answer" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            author: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            introduction: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["heading", "content"]
              }
            },
            conclusion: { type: Type.STRING },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["title", "excerpt", "author", "tags", "introduction", "sections", "conclusion", "faqs"]
        }
      }
    });

    // CORRECT USAGE: .text property, not .text() method
    const text = response.text;
    
    if (!text) {
        throw new Error("No response text received from Gemini");
    }

    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Error generating blog content:", error);
    // Return the actual error message so the frontend can display it
    res.status(500).json({ message: "Failed to generate content", error: error.message });
  }
});

module.exports = router;
