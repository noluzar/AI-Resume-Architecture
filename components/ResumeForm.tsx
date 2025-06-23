
import React, { useCallback } from 'react';
import { ResumeData, PersonalDetails, WorkExperience, Education, Skill, CustomSection, ResumeSection } from '../types';

type ItemSectionKey = keyof Pick<ResumeData, 'experience' | 'education' | 'skills' | 'customSections'>;

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  onUpdateSection: <K extends keyof ResumeData, V extends ResumeData[K]>(section: K, value: V) => void;
  onAddItem: <S extends ItemSectionKey>(
    section: S,
    newItem: Omit<ResumeData[S][number], 'id'>
  ) => void;
  onUpdateItem: <S extends ItemSectionKey>(
    section: S,
    updatedItem: ResumeData[S][number]
  ) => void;
  onRemoveItem: (section: ItemSectionKey, itemId: string) => void;
  onGenerateAI: (section: ResumeSection, context?: string, itemId?: string) => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; name?: string; }> = ({ label, value, onChange, type = "text", placeholder, name }) => (
  <div className="mb-4">
    <label htmlFor={name || label.toLowerCase().replace(/\s/g, '-')} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name || label.toLowerCase().replace(/\s/g, '-')}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; name?: string; rows?:number; onGenerateAI?: () => void; }> = ({ label, value, onChange, placeholder, name, rows = 3, onGenerateAI }) => (
  <div className="mb-4">
    <label htmlFor={name || label.toLowerCase().replace(/\s/g, '-')} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <textarea
        id={name || label.toLowerCase().replace(/\s/g, '-')}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      {onGenerateAI && (
         <button 
            type="button" 
            onClick={onGenerateAI} 
            title={`Generate ${label} with AI`}
            aria-label={`Generate ${label} with AI`}
            className="absolute top-2 right-2 p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full text-xs transition-colors duration-150"
          >
           ✨ AI
          </button>
      )}
    </div>
  </div>
);

const ResumeForm: React.FC<ResumeFormProps> = ({
  resumeData,
  onUpdatePersonalDetails,
  onUpdateSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onGenerateAI
}) => {
  const handlePersonalDetailsChange = useCallback((field: keyof PersonalDetails, value: string) => {
    onUpdatePersonalDetails({ [field]: value });
  }, [onUpdatePersonalDetails]);

  const handleSummaryChange = useCallback((value: string) => {
    onUpdateSection('summary', value);
  }, [onUpdateSection]);

  const commonSectionProps = { onUpdateItem, onRemoveItem, onAddItem, onGenerateAI };

  return (
    <form className="space-y-6">
      <FormSection title="Personal Details">
        <InputField name="fullName" label="Full Name" value={resumeData.personalDetails.fullName} onChange={v => handlePersonalDetailsChange('fullName', v)} />
        <InputField name="email" label="Email" type="email" value={resumeData.personalDetails.email} onChange={v => handlePersonalDetailsChange('email', v)} />
        <InputField name="phone" label="Phone" type="tel" value={resumeData.personalDetails.phone} onChange={v => handlePersonalDetailsChange('phone', v)} />
        <InputField name="address" label="Address" value={resumeData.personalDetails.address || ''} onChange={v => handlePersonalDetailsChange('address', v)} />
        <InputField name="linkedin" label="LinkedIn Profile URL" value={resumeData.personalDetails.linkedin || ''} onChange={v => handlePersonalDetailsChange('linkedin', v)} />
        <InputField name="portfolio" label="Portfolio/Website URL" value={resumeData.personalDetails.portfolio || ''} onChange={v => handlePersonalDetailsChange('portfolio', v)} />
      </FormSection>

      <FormSection title="Professional Summary">
        <TextAreaField 
          label="Summary"
          name="summary" 
          value={resumeData.summary} 
          onChange={handleSummaryChange} 
          rows={5}
          onGenerateAI={() => onGenerateAI('summary', resumeData.summary)}
        />
      </FormSection>

      <ExperienceSection items={resumeData.experience} {...commonSectionProps} />
      <EducationSection items={resumeData.education} {...commonSectionProps} />
      <SkillsSection items={resumeData.skills} {...commonSectionProps} />
      <CustomSections items={resumeData.customSections} {...commonSectionProps} />

    </form>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}
const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="pt-6">
    <h2 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-300">{title}</h2>
    {children}
  </div>
);

// Experience Section Component
const ExperienceSection: React.FC<{ items: WorkExperience[]; } & Pick<ResumeFormProps, 'onUpdateItem' | 'onRemoveItem' | 'onAddItem' | 'onGenerateAI'>> = ({ items, onUpdateItem, onRemoveItem, onAddItem, onGenerateAI }) => {
  const defaultItem: Omit<WorkExperience, 'id'> = { jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] };
  return (
    <FormSection title="Work Experience">
      {items.map((exp, index) => (
        <div key={exp.id} className="mb-6 p-4 border border-gray-200 rounded-md relative bg-white shadow-sm">
          <InputField name={`exp-jobTitle-${exp.id}`} label="Job Title" value={exp.jobTitle} onChange={v => onUpdateItem('experience', { ...exp, jobTitle: v })} />
          <InputField name={`exp-company-${exp.id}`} label="Company" value={exp.company} onChange={v => onUpdateItem('experience', { ...exp, company: v })} />
          <InputField name={`exp-location-${exp.id}`} label="Location" value={exp.location || ''} onChange={v => onUpdateItem('experience', { ...exp, location: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField name={`exp-startDate-${exp.id}`} label="Start Date" value={exp.startDate} onChange={v => onUpdateItem('experience', { ...exp, startDate: v })} placeholder="e.g., Jan 2020"/>
            <InputField name={`exp-endDate-${exp.id}`} label="End Date" value={exp.endDate} onChange={v => onUpdateItem('experience', { ...exp, endDate: v })} placeholder="e.g., Present or Dec 2022"/>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities/Achievements</label>
            {exp.responsibilities.map((resp, rIndex) => (
              <div key={rIndex} className="flex items-center mb-1">
                <input
                  type="text"
                  aria-label={`Responsibility ${rIndex + 1} for ${exp.jobTitle}`}
                  value={resp}
                  onChange={e => {
                    const newResp = [...exp.responsibilities];
                    newResp[rIndex] = e.target.value;
                    onUpdateItem('experience', { ...exp, responsibilities: newResp });
                  }}
                  className="w-full p-1.5 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bullet point"
                />
                <button type="button" aria-label={`Remove responsibility ${rIndex + 1}`} onClick={() => {
                    const newResp = exp.responsibilities.filter((_, idx) => idx !== rIndex);
                    onUpdateItem('experience', { ...exp, responsibilities: newResp.length > 0 ? newResp : [''] });
                }} className="ml-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-150">Remove</button>
              </div>
            ))}
            <div className="flex items-center space-x-3 mt-2">
                <button type="button" onClick={() => onUpdateItem('experience', { ...exp, responsibilities: [...exp.responsibilities, ''] })} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-150">Add Bullet Point</button>
                <button 
                  type="button" 
                  onClick={() => onGenerateAI('experienceItem', `${exp.jobTitle} at ${exp.company}`, exp.id)} 
                  title="Generate responsibilities with AI"
                  aria-label={`Generate responsibilities with AI for ${exp.jobTitle}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-150 flex items-center"
                >
                 <span className="mr-1">✨</span> AI Bullets
                </button>
            </div>
          </div>
          <button type="button" aria-label={`Remove ${exp.jobTitle} experience`} onClick={() => onRemoveItem('experience', exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-150">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onAddItem('experience', defaultItem)} className="mt-2 text-sm bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-sm transition-colors duration-150">Add Experience</button>
    </FormSection>
  );
};


// Education Section Component
const EducationSection: React.FC<{ items: Education[]; } & Pick<ResumeFormProps, 'onUpdateItem' | 'onRemoveItem' | 'onAddItem'>> = ({ items, onUpdateItem, onRemoveItem, onAddItem }) => {
  const defaultItem: Omit<Education, 'id'> = { degree: '', institution: '', location: '', graduationDate: '', details: '' };
  return (
    <FormSection title="Education">
      {items.map((edu) => (
        <div key={edu.id} className="mb-6 p-4 border border-gray-200 rounded-md relative bg-white shadow-sm">
          <InputField name={`edu-degree-${edu.id}`} label="Degree/Certificate" value={edu.degree} onChange={v => onUpdateItem('education', { ...edu, degree: v })} />
          <InputField name={`edu-institution-${edu.id}`} label="Institution" value={edu.institution} onChange={v => onUpdateItem('education', { ...edu, institution: v })} />
          <InputField name={`edu-location-${edu.id}`} label="Location" value={edu.location || ''} onChange={v => onUpdateItem('education', { ...edu, location: v })} />
          <InputField name={`edu-graduationDate-${edu.id}`} label="Graduation Date" value={edu.graduationDate} onChange={v => onUpdateItem('education', { ...edu, graduationDate: v })} placeholder="e.g., May 2020"/>
          <InputField name={`edu-details-${edu.id}`} label="Details (GPA, Honors, etc.)" value={edu.details || ''} onChange={v => onUpdateItem('education', { ...edu, details: v })} />
          <button type="button" aria-label={`Remove ${edu.degree} education`} onClick={() => onRemoveItem('education', edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-150">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onAddItem('education', defaultItem)} className="mt-2 text-sm bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-sm transition-colors duration-150">Add Education</button>
    </FormSection>
  );
};

// Skills Section Component
const SkillsSection: React.FC<{ items: Skill[]; } & Pick<ResumeFormProps, 'onUpdateItem' | 'onRemoveItem' | 'onAddItem'>> = ({ items, onUpdateItem, onRemoveItem, onAddItem }) => {
  const defaultItem: Omit<Skill, 'id'> = { name: '' };
  return (
    <FormSection title="Skills">
      <div className="space-y-3">
      {items.map((skill) => (
        <div key={skill.id} className="flex items-center">
          <input
            type="text"
            aria-label={`Skill name ${skill.id}`}
            value={skill.name}
            onChange={e => onUpdateItem('skills', { ...skill, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., React, Project Management"
          />
          <button type="button" aria-label={`Remove skill ${skill.name}`} onClick={() => onRemoveItem('skills', skill.id)} className="ml-3 text-sm text-red-500 hover:text-red-700 transition-colors duration-150">Remove</button>
        </div>
      ))}
      </div>
      <button type="button" onClick={() => onAddItem('skills', defaultItem)} className="mt-4 text-sm bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-sm transition-colors duration-150">Add Skill</button>
    </FormSection>
  );
};

// Custom Sections Component
const CustomSections: React.FC<{ items: CustomSection[]; } & Pick<ResumeFormProps, 'onUpdateItem' | 'onRemoveItem' | 'onAddItem'>> = ({ items, onUpdateItem, onRemoveItem, onAddItem }) => {
  const defaultItem: Omit<CustomSection, 'id'> = { title: '', content: '' };
  return (
    <FormSection title="Custom Sections">
      {items.map((section) => (
        <div key={section.id} className="mb-6 p-4 border border-gray-200 rounded-md relative bg-white shadow-sm">
          <InputField name={`custom-title-${section.id}`} label="Section Title" value={section.title} onChange={v => onUpdateItem('customSections', { ...section, title: v })} />
          <TextAreaField name={`custom-content-${section.id}`} label="Content" value={section.content} onChange={v => onUpdateItem('customSections', { ...section, content: v })} />
          <button type="button" aria-label={`Remove custom section ${section.title}`} onClick={() => onRemoveItem('customSections', section.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-150">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onAddItem('customSections', defaultItem)} className="mt-2 text-sm bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-sm transition-colors duration-150">Add Custom Section</button>
    </FormSection>
  );
};


export default ResumeForm;
