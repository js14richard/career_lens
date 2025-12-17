import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const extractResumeInsights = async (resumeText) => {
  try {
    const prompt = `
    You are an AI that extracts structured information from resumes.
      
    From the resume text below, extract:
      
    1. Technical skills
    2. Total years of professional experience (number only)
    3. Short professional summary (2–3 lines)
    4. Work experience details:
       - Company
       - Designation
       - Duration (e.g., "Jan 2022 – Mar 2024")
       - Short responsibility summary (1–2 lines)
      
    Return ONLY valid JSON in this format:
    {
      "skills": [],
      "experienceYears": 0,
      "summary": "",
      "workExperience": [
        {
          "company": "",
          "designation": "",
          "duration": "",
          "summary": ""
        }
      ]
    }
      
    Resume Text:
    """
    ${resumeText}
    """
      
    IMPORTANT:
    - Output ONLY raw JSON
    - No explanations
    - No markdown
    - Must be JSON.parse() safe
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You extract structured resume data." },
        { role: "user", content: prompt }
      ]
    });

    const raw = response.choices[0].message.content;
    const cleaned = cleanAIJson(raw);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ RAW AI RESPONSE:", raw);
      throw new Error("Invalid AI JSON response");
    }

    return parsed;
  } catch (error) {
    console.error("Resume AI Extraction Error:", error);
    throw new Error("Failed to extract resume insights");
  }
};

function cleanAIJson(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}
