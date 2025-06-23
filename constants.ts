
import { CustomizationOptions, TemplateId, ColorScheme, FontOptions, ResumeData } from './types';

export const DEFAULT_FONT_FAMILY = 'font-sans';
export const DEFAULT_FONT_SIZE = 'text-base';

export const FONT_FAMILIES = [
  { name: 'Sans Serif', value: 'font-sans' },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Monospace', value: 'font-mono' },
];

export const FONT_SIZES = [
  { name: 'Small', value: 'text-sm' },
  { name: 'Normal', value: 'text-base' },
  { name: 'Large', value: 'text-lg' },
];

export const INITIAL_COLOR_SCHEMES: Record<string, ColorScheme> = {
  default: { name: 'Default Blue', primary: 'text-blue-700', secondary: 'text-gray-700', accent: 'border-blue-500', background: 'bg-white', text: 'text-gray-900' },
  charcoal: { name: 'Charcoal Grace', primary: 'text-gray-800', secondary: 'text-gray-600', accent: 'border-gray-700', background: 'bg-white', text: 'text-gray-900' },
  ocean: { name: 'Ocean Deep', primary: 'text-sky-700', secondary: 'text-slate-600', accent: 'border-sky-500', background: 'bg-white', text: 'text-gray-900' },
  emerald: { name: 'Emerald Shine', primary: 'text-emerald-700', secondary: 'text-neutral-600', accent: 'border-emerald-500', background: 'bg-white', text: 'text-gray-900' },
  crimson: { name: 'Crimson Bold', primary: 'text-red-700', secondary: 'text-rose-600', accent: 'border-red-500', background: 'bg-white', text: 'text-gray-900' },
};

export const INITIAL_CUSTOMIZATION_OPTIONS: CustomizationOptions = {
  templateId: TemplateId.CLASSIC,
  colorScheme: INITIAL_COLOR_SCHEMES.default,
  fontOptions: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
  },
};

export const TEMPLATES = [
    { id: TemplateId.CLASSIC, name: 'Classic Professional' },
    { id: TemplateId.MODERN, name: 'Modern Minimalist' },
    { id: TemplateId.CREATIVE, name: 'Creative Impact' },
];

export const INITIAL_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: 'Your Name',
    email: 'youremail@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/yourprofile',
    portfolio: 'yourportfolio.com',
    address: 'City, State',
  },
  summary: 'A brief professional summary highlighting your key skills and career goals. Tailor this to the job you are applying for.',
  experience: [
    { id: 'exp1', jobTitle: 'Senior Developer', company: 'Tech Solutions Inc.', location: 'San Francisco, CA', startDate: 'Jan 2020', endDate: 'Present', responsibilities: ['Led a team of 5 developers.', 'Developed and maintained key features.', 'Improved application performance by 20%.'] },
    { id: 'exp2', jobTitle: 'Software Engineer', company: 'Web Innovations LLC', location: 'Austin, TX', startDate: 'Jun 2017', endDate: 'Dec 2019', responsibilities: ['Contributed to a large-scale web application.', 'Collaborated with cross-functional teams.', 'Wrote unit and integration tests.'] },
  ],
  education: [
    { id: 'edu1', degree: 'M.S. in Computer Science', institution: 'State University', location: 'New York, NY', graduationDate: 'May 2017', details: 'GPA: 3.8/4.0' },
    { id: 'edu2', degree: 'B.S. in Software Engineering', institution: 'Tech College', location: 'Boston, MA', graduationDate: 'May 2015', details: 'Summa Cum Laude' },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript (React, Node.js)' },
    { id: 'skill2', name: 'Python (Django, Flask)' },
    { id: 'skill3', name: 'Cloud Computing (AWS, Azure)' },
    { id: 'skill4', name: 'Agile Methodologies' },
  ],
  customSections: [
    { id: 'custom1', title: 'Projects', content: 'Developed a personal finance tracker app using React Native and Firebase.'}
  ],
};

export const GEMINI_API_KEY_ERROR_MESSAGE = "API Key not configured. Please ensure the API_KEY environment variable is set.";
export const GEMINI_GENERAL_ERROR_MESSAGE = "An error occurred while communicating with the AI. Please try again.";
