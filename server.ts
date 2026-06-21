import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory simple storage for reports back-up on the backend
const reportsDb: any[] = [];

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI analysis will run with fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// 2. Fetch all reports from memory
app.get("/api/reports", (req, res) => {
  res.json(reportsDb);
});

// 3. Save a report to memory
app.post("/api/reports", (req, res) => {
  const report = {
    id: req.body.id || `rep_${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString(),
    personalInfo: req.body.personalInfo,
    symptoms: req.body.symptoms,
    duration: req.body.duration,
    severity: req.body.severity,
    additionalDetails: req.body.additionalDetails,
    analysis: req.body.analysis,
  };
  reportsDb.unshift(report);
  if (reportsDb.length > 50) {
    reportsDb.pop(); // Keep database light
  }
  res.json({ success: true, report });
});

// 4. Analyze Symptoms route (Proxies to Gemini API)
app.post("/api/analyze", async (req, res) => {
  const { personalInfo, symptoms, duration, severity, additionalDetails } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: "Symptoms list is required." });
  }

  // Construct structured detailed analysis prompt
  const prompt = `
  You are an expert, highly supportive AI Medical Assistant and triage supervisor panel. You will analyze the provided patient data and prepare a structured, educational triage assessment report.
  
  PATIENT DATA:
  - Age: ${personalInfo?.age || "Not specified"} years old
  - Biological Sex: ${personalInfo?.gender || "Not specified"}
  - High-level physiological notes: Height: ${personalInfo?.height || "N/A"} cm, Weight: ${personalInfo?.weight || "N/A"} kg
  - Symptoms: ${symptoms.join(", ")}
  - Severity Level reported by patient: ${severity || "Moderate"} on 1-10 intensity scale
  - Duration of Symptoms: ${duration || "Not specified"}
  - Narrative Details: ${additionalDetails || "No additional context provided."}

  Examine these symptoms thoroughly. You must return possible conditions matching the symptoms, detailed considerations, appropriate level of severity, treatment choices along with their pros and cons, emergency warning signs (red flags), and explicit guidelines for consulting a real professional doctor.

  IMPORTANT: As this is an AI tool, you must append a professional triage disclaimer stating that this assessment is strictly for educational guidance and prioritizing symptoms, and does not constitute formal medical diagnosis or standard medical advice.
  `;

  // Fallback clinical mock analysis if API Key is not set or fails (enables graceful degradation)
  const getMockAnalysis = () => {
    return {
      conditions: [
        {
          name: `Presumptive viral respiratory response to: ${symptoms[0]}`,
          likelihood: "High",
          severity: severity && parseInt(severity) > 7 ? "Severe" : "Moderate",
          description: `An acute inflammatory process, likely of infectious origin, consistent with reported symptoms like ${symptoms.join(", ")}. This manifests commonly during seasonal shifts or exposure.`,
          treatments: [
            {
              name: "Symptomatic Hydration & Supportive Rest",
              pros: ["Reduces cardiovascular stress", "Unrestricted access", "Zero chemical adverse risks"],
              cons: ["Does not treat microbial cause if bacterial", "Gradual slow therapeutic onset"]
            },
            {
              name: "Over-The-Counter Mucolytics or NSAIDs (under pharmacist supervision)",
              pros: ["Rapid localized inflammatory relief", "Promotes easier chest clearances"],
              cons: ["May trigger mild gastric sensitivity", "Does not eradicate virus, only manages presentation"]
            }
          ],
          warningSigns: [
            "Severe persistent respiratory distress (shortness of breath)",
            "High spike fever unresponsive to standard anti-pyretics",
            "Bluish tint in lips or peripheral fingers (cyanosis indicators)"
          ]
        },
        {
          name: "Localized Mild Myalgia or Fatigue Stress",
          likelihood: "Medium",
          severity: "Mild",
          description: `Musculoskeletal or systemic fatigue pattern potentially secondary to immune responses or active exertion associated with ${symptoms.join(", ")}.`,
          treatments: [
            {
              name: "Targeted Warm Compress & Controlled Stretching",
              pros: ["Improves micro-circulation locally", "Induces physical muscular relaxation"],
              cons: ["Transient benefit", "Inconvenient to administer in active daytime"]
            }
          ],
          warningSigns: [
            "Sudden neurological focal deficits",
            "Inability to sustain regular load posture",
            "Intolerable worsening localized pain intensity"
          ]
        }
      ],
      generalAdvice: "Please note: This initial feedback is fully generated by the HealthAI core engine based on standard textbook triage scenarios. It is purely advisory for medical context tracking.",
      doctorAdvice: "We recommend scheduling a telehealth consultation or visiting an outpatient clinic. If symptoms worsen, transition quickly to an urgent care facility or primary care physician. Bring a log of symptoms and duration."
    };
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("No GEMINI_API_KEY; returning mock health assessment report.");
      return res.json({
        analysis: getMockAnalysis(),
        disclaimer: "EDUCATIONAL ONLY: This information is generated by HealthAI's simulation system as no live API configurations were active. Always consult a general practitioner."
      });
    }

    const ai = getGeminiClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are HealthAI, an advanced 3D medical triage diagnostic advisor designed to evaluate physiological symptom duration and intensity to output highly structured, accurate, educational triage options. You must remain clinical, structured, helpful, objective, and clearly define that you are an AI triage assistant.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conditions: {
              type: Type.ARRAY,
              description: "List of possible conditions or symptom syndromes that match the presentation.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  likelihood: { type: Type.STRING, description: "e.g., High, Medium, Low" },
                  severity: { type: Type.STRING, description: "e.g., Mild, Moderate, Severe" },
                  description: { type: Type.STRING },
                  treatments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["name", "pros", "cons"]
                    }
                  },
                  warningSigns: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Critical red flag symptoms for this condition requiring immediate emergency care."
                  }
                },
                required: ["name", "likelihood", "severity", "description", "treatments", "warningSigns"]
              }
            },
            generalAdvice: { type: Type.STRING, description: "Overall clinical overview summarizing the situation." },
            doctorAdvice: { type: Type.STRING, description: "Actionable specifications of who to contact, what department, or diagnostic screenings to inquire." }
          },
          required: ["conditions", "generalAdvice", "doctorAdvice"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response content from Gemini API.");
    }

    const parsedAnalysis = JSON.parse(responseText.trim());
    res.json({
      analysis: parsedAnalysis,
      disclaimer: "AI TRIAGE DISCLAIMER: HealthAI is a clinical-grade educational triage advisor. This report summarizes academic references matching your report parameters. It is NOT a professional clinical diagnosis. If you are experiencing high-risk conditions or extreme discomfort, please dial emergency services immediately."
    });

  } catch (error: any) {
    console.error("Gemini AI API assessment failure:", error);
    res.status(500).json({
      error: "AI Triage analysis session timed out or failed to parse.",
      details: error.message,
      analysis: getMockAnalysis(),
      disclaimer: "FALLBACK: A core processing issue occurred. We have retrieved a basic emergency symptom summary schema. Please monitor warning signs carefully and seek professional clinical care."
    });
  }
});

// Configure Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HealthAI Backend] Active and listening at http://localhost:${PORT}`);
  });
}

startServer();
