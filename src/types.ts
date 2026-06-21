export type TabType = 'dashboard' | 'assessment' | 'analysis' | 'reports' | 'settings';

export interface PersonalInfo {
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  weight: string;
  height: string;
  existingConditions: string;
}

export interface SymptomCategory {
  name: string;
  id: string;
  icon: string;
  symptoms: string[];
}

export interface ConditionTreatment {
  name: string;
  pros: string[];
  cons: string[];
}

export interface Condition {
  name: string;
  likelihood: string; // High, Medium, Low
  severity: string; // Mild, Moderate, Severe
  description: string;
  treatments: ConditionTreatment[];
  warningSigns: string[];
}

export interface AnalysisResponse {
  conditions: Condition[];
  generalAdvice: string;
  doctorAdvice: string;
}

export interface HealthReport {
  id: string;
  createdAt: string;
  personalInfo: PersonalInfo;
  symptoms: string[];
  duration: string;
  severity: number;
  additionalDetails: string;
  analysis: AnalysisResponse;
  disclaimer?: string;
}

// Interactive symptoms database for Step 2
export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    name: "Respiratory Track",
    id: "respiratory",
    icon: "Activity",
    symptoms: [
      "Dry Cough",
      "Productive Cough (flegm)",
      "Sore Throat",
      "Shortness of Breath",
      "Nasal Congestion",
      "Wheezing",
      "Chest Tightness"
    ]
  },
  {
    name: "General & Immune",
    id: "systemic",
    icon: "ShieldAlert",
    symptoms: [
      "Fever / Chills",
      "Chronic Fatigue",
      "Generalized Body Aches",
      "Headache",
      "Night Sweats",
      "Dizziness / Lightheadedness",
      "Swollen Lymph Nodes"
    ]
  },
  {
    name: "Gastrointestinal",
    id: "digestive",
    icon: "HeartPulse",
    symptoms: [
      "Nausea / Queasiness",
      "Enfeebling Stomach Pain",
      "Acute Diarrhea",
      "Vomiting",
      "Acid Reflux / Heartburn",
      "Loss of Appetite",
      "Bloating"
    ]
  },
  {
    name: "Muscular & Structural",
    id: "structural",
    icon: "Milestone",
    symptoms: [
      "Low Back Strain",
      "Joint Tension / Stiffness",
      "Muscle Cramping",
      "Neck Stiffness",
      "Peripheral Numbness"
    ]
  },
  {
    name: "Dermatological",
    id: "integumentary",
    icon: "Sparkles",
    symptoms: [
      "Pruritus (Severe Itching)",
      "Unexplained Skin Rash",
      "Dry Flacking Lesions",
      "Local Redness / Swelling",
      "Hives"
    ]
  }
];

export const DURATION_OPTIONS = [
  "Less than 24 hours",
  "1 to 3 days",
  "4 to 7 days",
  "1 to 2 weeks",
  "More than a month"
];
