
import React, { forwardRef } from 'react';
import { ResumeData, CustomizationOptions, TemplateId } from '../types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  options: CustomizationOptions;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData, options }, ref) => {
  const renderTemplate = () => {
    switch (options.templateId) {
      case TemplateId.MODERN:
        return <ModernTemplate resumeData={resumeData} options={options} />;
      case TemplateId.CREATIVE:
        return <CreativeTemplate resumeData={resumeData} options={options} />;
      case TemplateId.CLASSIC:
      default:
        return <ClassicTemplate resumeData={resumeData} options={options} />;
    }
  };

  return (
    <div id="resume-preview-content" ref={ref} className={`p-8 shadow-lg w-full max-w-4xl mx-auto print:shadow-none print:p-0 ${options.colorScheme.background} ${options.fontOptions.fontFamily} ${options.fontOptions.fontSize}`}>
      {renderTemplate()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
