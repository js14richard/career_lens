import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const extractResumeInsights = async (resumeText) => {
  try {
    const prompt = `
    You are an AI that extracts structured information from resumes.
    
    From the resume text below, extract:
    1. A list of technical skills
    2. Total years of professional experience (number only)
    3. A short professional summary (2–3 lines)
    
    Return ONLY valid JSON in this exact format:
    {
      "skills": [],
      "experienceYears": 0,
      "summary": ""
    }
    
    Resume Text:
    """
    ${resumeText}
    """
    
    IMPORTANT RULES:
    - Output ONLY raw JSON
    - Do NOT wrap the response in \`\`\` or \`\`\`json
    - Do NOT include any explanation or extra text
    - The response must be directly parseable by JSON.parse()
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You extract structured resume data." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const content = response.choices[0].message.content;

    const cleanedResponse = cleanAIJson(content);

    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("❌ RAW AI RESPONSE:\n", content);
      console.error("❌ CLEANED AI RESPONSE:\n", cleanedResponse);
      throw new Error("AI returned invalid JSON");
    }

    return {
      skills: parsed.skills || [],
      experienceYears: parsed.experienceYears || 0,
      summary: parsed.summary || ""
    };

  } catch (error) {
    console.error("Resume AI Extraction Error:", error);
    throw new Error("Failed to extract resume insights using AI");
  }
};


function cleanAIJson(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}