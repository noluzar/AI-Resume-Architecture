
import React from 'react';
import { ResumeData, CustomizationOptions, WorkExperience, Education, Skill, CustomSection } from '../../types';

interface TemplateProps {
  resumeData: ResumeData;
  options: CustomizationOptions;
}

const ModernTemplate: React.FC<TemplateProps> = ({ resumeData, options }) => {
  const { personalDetails, summary, experience, education, skills, customSections } = resumeData;
  const { colorScheme, fontOptions } = options;

  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={`mb-8 ${className}`}>
      <h2 className={`text-sm font-semibold uppercase tracking-wider ${colorScheme.primary} mb-3 pb-1 border-b ${colorScheme.accent}`}>{title}</h2>
      {children}
    </section>
  );

  return (
    <div className={`${colorScheme.background} ${colorScheme.text} ${fontOptions.fontFamily} ${fontOptions.fontSize} p-8 print:p-0 flex`}>
      {/* Sidebar */}
      <aside className={`w-1/3 pr-8 border-r ${colorScheme.accent} print:w-1/3`}>
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${colorScheme.primary}`}>{personalDetails.fullName}</h1>
          {/* <p className={`text-md ${colorScheme.secondary}`}>{ experience.length > 0 ? experience[0].jobTitle : 'Your Professional Title'}</p> */}
        </div>
        
        <Section title="Contact" className="text-sm">
          <p>{personalDetails.phone}</p>
          <p className="break-all">{personalDetails.email}</p>
          {personalDetails.address && <p>{personalDetails.address}</p>}
          {personalDetails.linkedin && <a href={personalDetails.linkedin} className={`block hover:${colorScheme.primary} underline`}>LinkedIn</a>}
          {personalDetails.portfolio && <a href={personalDetails.portfolio} className={`block hover:${colorScheme.primary} underline`}>Portfolio</a>}
        </Section>

        {skills.length > 0 && (
          <Section title="Skills" className="text-sm">
            <ul className="space-y-1">
              {skills.map((skill: Skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </Section>
        )}
        
        {education.length > 0 && (
          <Section title="Education" className="text-sm">
            {education.map((edu: Education) => (
              <div key={edu.id} className="mb-3">
                <h3 className={`font-semibold ${colorScheme.primary}`}>{edu.degree}</h3>
                <p className={`${colorScheme.secondary}`}>{edu.institution}</p>
                <p className={`text-xs ${colorScheme.secondary}`}>{edu.location}</p>
                <p className={`text-xs ${colorScheme.secondary}`}>{edu.graduationDate}</p>
                {edu.details && <p className="text-xs">{edu.details}</p>}
              </div>
            ))}
          </Section>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 pl-8 print:w-2/3">
        {summary && (
          <Section title="Profile">
            <p className="text-justify">{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp: WorkExperience) => (
              <div key={exp.id} className="mb-5">
                <h3 className={`text-lg font-semibold ${colorScheme.primary}`}>{exp.jobTitle}</h3>
                <p className={`italic ${colorScheme.secondary} text-sm`}>{exp.company} | {exp.location}</p>
                <p className={`text-xs ${colorScheme.secondary} mb-1`}>{exp.startDate} - {exp.endDate}</p>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                  {exp.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}
        
        {customSections.map((section: CustomSection) => (
          section.title && section.content && (
            <Section key={section.id} title={section.title}>
              <div className="whitespace-pre-wrap text-sm">{section.content}</div>
            </Section>
          )
        ))}
      </main>
    </div>
  );
};

export default ModernTemplate;
