
export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  address?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  details?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string; 
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  customSections: CustomSection[];
}

export enum TemplateId {
  CLASSIC = 'classic',
  MODERN = 'modern',
  CREATIVE = 'creative',
}

export interface FontOptions {
  fontFamily: string;
  fontSize: string; 
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  name?: string; // Optional name for the color scheme
}

export interface CustomizationOptions {
  templateId: TemplateId;
  colorScheme: ColorScheme;
  fontOptions: FontOptions;
}

export type ResumeSection = keyof Omit<ResumeData, 'personalDetails' | 'experience' | 'education' | 'skills' | 'customSections'> | 'experienceItem' | 'educationItem' | 'skillItem';

export interface ModalContentType {
  title: string;
  content: React.ReactNode | string;
  actions?: React.ReactNode;
}
