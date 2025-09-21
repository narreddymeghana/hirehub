import { GoogleGenAI } from "@google/genai";

// --- TYPES (Consolidated) ---
export enum UserRole {
  RECRUITER = 'Recruiter',
  JOB_SEEKER = 'Job Seeker',
}
export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  REMOTE = 'Remote',
}
export enum ExperienceLevel {
    ENTRY = 'Entry Level',
    MID = 'Mid Level',
    SENIOR = 'Senior Level',
}
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  description: string;
  datePosted: string;
}
export interface Application {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter?: string;
  resume: string;
}
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// --- GEMINI SERVICE (Consolidated) ---
// FIX: Per guidelines, assume API_KEY is present and initialize GoogleGenAI directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateJobDescription = async (title: string, keywords: string): Promise<string> => {
  const prompt = `Generate a compelling and professional job description for a "${title}" position. Include these keywords: ${keywords}. Structure it with "## Job Description", "## Requirements", and "## Benefits" headers. Output plain text without other markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating job description:", error);
    throw new Error("Failed to generate description from AI.");
  }
};

// --- INITIAL DATA (Consolidated) ---
export const starterJobs: JobPosting[] = [
  {
    id: '1', title: 'Senior Frontend Developer', company: 'TechCorp Inc.', location: 'San Francisco, CA', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.SENIOR, salaryMin: 120000, salaryMax: 180000, tags: ['React', 'TypeScript', 'Next.js'],
    description: `## Job Description\nWe're looking for a skilled Senior Frontend Developer to join our dynamic team. You'll be responsible for building cutting-edge web applications using modern technologies and best practices.\n## Requirements\n- 5+ years of experience with React and modern JavaScript.\n- Strong knowledge of TypeScript and Next.js.\n- Experience with state management (Redux, Zustand).\n## Benefits\n- Competitive salary and equity package.\n- Health, dental, and vision insurance.\n- Flexible work arrangements.`,
    datePosted: '2024-07-22T10:00:00Z',
  },
  {
    id: '2', title: 'Product Manager', company: 'InnovateLabs', location: 'New York, NY', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, salaryMin: 130000, salaryMax: 200000, tags: ['Strategy', 'Analytics', 'Leadership'],
    description: `## Job Description\nWe are seeking an experienced Product Manager to guide the development of our flagship product. You will work with cross-functional teams to design, build, and roll-out products that deliver the company’s vision and strategy.\n## Requirements\n- 4+ years of product management experience.\n- Proven track record of managing all aspects of a successful product throughout its lifecycle.\n## Benefits\n- A-class medical, dental, and vision insurance.\n- 401(k) with company match.\n- Generous vacation policy.`,
    datePosted: '2024-07-21T14:30:00Z',
  },
  {
    id: '3', title: 'UX Designer', company: 'DesignStudio Pro', location: 'Remote', type: JobType.REMOTE, experienceLevel: ExperienceLevel.MID, salaryMin: 80000, salaryMax: 120000, tags: ['Figma', 'User Research', 'Prototyping'],
    description: `## Job Description\nJoin our fully remote team as a UX Designer to create intuitive and engaging user experiences. You will be responsible for the entire design process, from user research to final hand-off to engineering.\n## Requirements\n- 3+ years of UX design experience.\n- A strong portfolio showcasing your design process and projects.\n- Proficiency in Figma, Sketch, or Adobe XD.\n## Benefits\n- Fully remote work environment.\n- Flexible work hours.\n- Health and wellness stipend.`,
    datePosted: '2024-07-20T09:00:00Z',
  },
  {
    id: '4', title: 'Data Scientist', company: 'DataFlow Analytics', location: 'London, UK', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.SENIOR, salaryMin: 90000, salaryMax: 130000, tags: ['Python', 'Machine Learning', 'SQL'],
    description: `## Job Description\nWe are looking for a Data Scientist to analyze large amounts of raw information to find patterns that will help improve our company. We will rely on you to build data products to extract valuable business insights.\n## Requirements\n- Proven experience as a Data Scientist or Data Analyst.\n- Experience in data mining and machine learning.\n## Benefits\n- Pension scheme.\n- Private health insurance.\n- Continuous learning opportunities.`,
    datePosted: '2024-07-19T11:00:00Z',
  },
  {
    id: '5', title: 'DevOps Engineer', company: 'CloudTech Solutions', location: 'Berlin, Germany', type: JobType.CONTRACT, experienceLevel: ExperienceLevel.MID, salaryMin: 85000, salaryMax: 120000, tags: ['AWS', 'Docker', 'Kubernetes'],
    description: `## Job Description\nAs a DevOps Engineer, you will be responsible for deploying, automating, maintaining, and managing our cloud-based production system, to ensure the availability, performance, scalability, and security of productions systems.\n## Requirements\n- 2+ years of experience in a DevOps role.\n- Strong experience with AWS or other cloud providers.\n## Benefits\n- Competitive contract rate.\n- Opportunity to work with modern technologies.`,
    datePosted: '2024-07-18T16:00:00Z',
  },
  {
    id: '6', title: 'Junior Software Engineer', company: 'CodeCrafters', location: 'New York, NY', type: JobType.FULL_TIME, experienceLevel: ExperienceLevel.ENTRY, salaryMin: 75000, salaryMax: 95000, tags: ['JavaScript', 'Node.js', 'React'],
    description: `## Job Description\nWe are looking for a motivated Junior Software Engineer to join our growing team. You will have the opportunity to work on exciting projects and learn from experienced developers.\n## Requirements\n- Bachelor's degree in Computer Science or related field.\n- Solid understanding of fundamental web technologies.\n## Benefits\n- Mentorship program.\n- Comprehensive benefits package.\n- Opportunities for career growth.`,
    datePosted: '2024-07-23T08:00:00Z',
  },
];