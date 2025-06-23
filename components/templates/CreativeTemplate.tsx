
import React from 'react';
import { ResumeData, CustomizationOptions, WorkExperience, Education, Skill, CustomSection } from '../../types';

interface TemplateProps {
  resumeData: ResumeData;
  options: CustomizationOptions;
}

const CreativeTemplate: React.FC<TemplateProps> = ({ resumeData, options }) => {
  const { personalDetails, summary, experience, education, skills, customSections } = resumeData;
  const { colorScheme, fontOptions } = options;

  // Helper for dynamic primary color styling
  const primaryColorClass = colorScheme.primary.startsWith('text-') ? colorScheme.primary : `text-${colorScheme.primary}`;
  const accentBorderClass = colorScheme.accent.startsWith('border-') ? colorScheme.accent : `border-${colorScheme.accent}`;
  const accentBgClass = colorScheme.accent.startsWith('border-') 
    ? colorScheme.accent.replace('border-', 'bg-').replace('-500', '-100') // Heuristic for BG
    : `bg-${colorScheme.accent}-100`;


  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="relative mb-4">
      <h2 className={`text-2xl font-bold ${primaryColorClass} inline-block pr-4`}>{title}</h2>
      <div className={`absolute bottom-0 left-0 w-full h-1 ${accentBgClass.replace('-100', '-500')} opacity-50 transform translate-y-1/2`}></div>
    </div>
  );

  return (
    <div className={`${colorScheme.background} ${colorScheme.text} ${fontOptions.fontFamily} ${fontOptions.fontSize} p-8 print:p-0 min-h-[297mm]`}> {/* A4 height approx */}
      {/* Header with name and contact */}
      <div className={`p-6 mb-8 relative overflow-hidden rounded-lg ${accentBgClass}`}>
        <div className={`absolute -top-10 -left-10 w-32 h-32 ${primaryColorClass.replace('text-', 'bg-')} opacity-30 rounded-full`}></div>
        <div className={`absolute -bottom-12 -right-8 w-40 h-40 ${primaryColorClass.replace('text-', 'bg-')} opacity-20 rounded-full`}></div>
        
        <h1 className={`text-5xl font-extrabold ${primaryColorClass} mb-1 relative z-10`}>{personalDetails.fullName}</h1>
        <p className={`text-lg ${colorScheme.secondary} mb-2 relative z-10`}>{experience.length > 0 ? experience[0].jobTitle : 'Professional Profile'}</p>
        <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm ${colorScheme.secondary} relative z-10`}>
          <span>{personalDetails.email}</span>
          <span>{personalDetails.phone}</span>
          {personalDetails.address && <span>{personalDetails.address}</span>}
          {personalDetails.linkedin && <a href={personalDetails.linkedin} className={`hover:${primaryColorClass} underline`}>LinkedIn</a>}
          {personalDetails.portfolio && <a href={personalDetails.portfolio} className={`hover:${primaryColorClass} underline`}>Portfolio</a>}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Profile, Skills, Education) */}
        <div className="md:col-span-1 space-y-6">
          {summary && (
            <section>
              <SectionHeader title="Profile" />
              <p className="text-justify">{summary}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionHeader title="Skills" />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: Skill) => (
                  <span key={skill.id} className={`px-3 py-1 text-sm rounded-full ${accentBgClass} ${primaryColorClass}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <SectionHeader title="Education" />
              {education.map((edu: Education) => (
                <div key={edu.id} className="mb-3">
                  <h3 className={`text-md font-semibold ${primaryColorClass}`}>{edu.degree}</h3>
                  <p className={`italic text-sm ${colorScheme.secondary}`}>{edu.institution} - {edu.location}</p>
                  <p className={`text-xs ${colorScheme.secondary}`}>{edu.graduationDate}</p>
                  {edu.details && <p className="text-xs">{edu.details}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column (Experience, Custom Sections) */}
        <div className="md:col-span-2 space-y-6">
          {experience.length > 0 && (
            <section>
              <SectionHeader title="Experience" />
              {experience.map((exp: WorkExperience) => (
                <div key={exp.id} className={`mb-5 p-4 border-l-4 ${accentBorderClass} ${accentBgClass} rounded-r-md`}>
                  <h3 className={`text-lg font-semibold ${primaryColorClass}`}>{exp.jobTitle}</h3>
                  <p className={`italic ${colorScheme.secondary} text-sm`}>{exp.company} | {exp.location}</p>
                  <p className={`text-xs ${colorScheme.secondary} mb-2`}>{exp.startDate} - {exp.endDate}</p>
                  <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                    {exp.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {customSections.map((section: CustomSection) => (
            section.title && section.content && (
              <section key={section.id}>
              <SectionHeader title={section.title} />
              <div className="whitespace-pre-wrap text-sm">{section.content}</div>
              </section>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
