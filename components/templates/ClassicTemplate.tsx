
import React from 'react';
import { ResumeData, CustomizationOptions, WorkExperience, Education, Skill, CustomSection } from '../../types';

interface TemplateProps {
  resumeData: ResumeData;
  options: CustomizationOptions;
}

const SectionTitle: React.FC<{ title: string; accentColor: string; textColor: string }> = ({ title, accentColor, textColor }) => (
  <h2 className={`text-xl font-bold ${textColor} border-b-2 ${accentColor} pb-1 mb-3`}>{title.toUpperCase()}</h2>
);

const ClassicTemplate: React.FC<TemplateProps> = ({ resumeData, options }) => {
  const { personalDetails, summary, experience, education, skills, customSections } = resumeData;
  const { colorScheme, fontOptions } = options;

  return (
    <div className={`${colorScheme.background} ${colorScheme.text} ${fontOptions.fontFamily} ${fontOptions.fontSize} p-6 print:p-0`}>
      <header className="text-center mb-6">
        <h1 className={`text-4xl font-bold ${colorScheme.primary}`}>{personalDetails.fullName}</h1>
        <p className={`text-sm ${colorScheme.secondary} mt-1`}>
          {personalDetails.email} | {personalDetails.phone}
          {personalDetails.address && ` | ${personalDetails.address}`}
        </p>
        <p className={`text-sm ${colorScheme.secondary}`}>
          {personalDetails.linkedin && <a href={personalDetails.linkedin} className={`hover:${colorScheme.primary} underline`}>LinkedIn</a>}
          {personalDetails.portfolio && personalDetails.linkedin && " | "}
          {personalDetails.portfolio && <a href={personalDetails.portfolio} className={`hover:${colorScheme.primary} underline`}>Portfolio</a>}
        </p>
      </header>

      {summary && (
        <section className="mb-6">
          <SectionTitle title="Summary" accentColor={colorScheme.accent} textColor={colorScheme.primary} />
          <p className="text-justify">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Experience" accentColor={colorScheme.accent} textColor={colorScheme.primary} />
          {experience.map((exp: WorkExperience) => (
            <div key={exp.id} className="mb-4">
              <h3 className={`text-lg font-semibold ${colorScheme.primary}`}>{exp.jobTitle}</h3>
              <p className={`italic ${colorScheme.secondary}`}>{exp.company} | {exp.location}</p>
              <p className={`text-xs ${colorScheme.secondary} mb-1`}>{exp.startDate} - {exp.endDate}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {exp.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Education" accentColor={colorScheme.accent} textColor={colorScheme.primary} />
          {education.map((edu: Education) => (
            <div key={edu.id} className="mb-3">
              <h3 className={`text-lg font-semibold ${colorScheme.primary}`}>{edu.degree}</h3>
              <p className={`italic ${colorScheme.secondary}`}>{edu.institution} | {edu.location}</p>
              <p className={`text-xs ${colorScheme.secondary} mb-1`}>{edu.graduationDate}</p>
              {edu.details && <p className="text-sm">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Skills" accentColor={colorScheme.accent} textColor={colorScheme.primary} />
          <ul className="list-disc list-inside ml-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {skills.map((skill: Skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </section>
      )}

      {customSections.map((section: CustomSection) => (
         section.title && section.content && (
            <section key={section.id} className="mb-6">
            <SectionTitle title={section.title} accentColor={colorScheme.accent} textColor={colorScheme.primary} />
            <div className="whitespace-pre-wrap">{section.content}</div>
            </section>
         )
      ))}
    </div>
  );
};

export default ClassicTemplate;
