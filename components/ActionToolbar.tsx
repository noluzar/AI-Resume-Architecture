
import React from 'react';

interface ActionToolbarProps {
  onOptimizeKeywords: () => void;
  onATSCheck: () => void;
  onJobMatchAnalysis: () => void;
  onExport: (format: 'pdf' | 'html') => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; title?: string; icon?: React.ReactNode; className?: string }> = ({ onClick, children, title, icon, className }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title || (typeof children === 'string' ? children : 'Action button')}
    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ${className}`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

const ExportButton: React.FC<{ onClick: () => void; children: React.ReactNode; title?: string; icon?: React.ReactNode; }> = ({ onClick, children, title, icon }) => (
   <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title || (typeof children === 'string' ? children : 'Export button')}
    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
  >
    {icon}
    <span>{children}</span>
  </button>
);


const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onOptimizeKeywords,
  onATSCheck,
  onJobMatchAnalysis,
  onExport,
}) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4 no-print">
      <div className="flex flex-wrap gap-3 items-center">
        <h3 className="text-lg font-semibold text-slate-700 mr-4 hidden sm:block">Actions:</h3>
        <ActionButton onClick={onOptimizeKeywords} title="Suggest keywords based on your resume and industry" icon={<SparklesIcon />}>Keywords</ActionButton>
        <ActionButton onClick={onATSCheck} title="Get advice on ATS compatibility" icon={<ClipboardCheckIcon />}>ATS Check</ActionButton>
        <ActionButton onClick={onJobMatchAnalysis} title="Analyze resume against a job description" icon={<DocumentSearchIcon />}>Job Match</ActionButton>
        
        <div className="ml-auto flex flex-wrap gap-3">
          <ExportButton onClick={() => onExport('html')} title="Download as HTML file" icon={<DownloadIcon />}>HTML</ExportButton>
          <ExportButton onClick={() => onExport('pdf')} title="Download as PDF file" icon={<PrinterIcon />}>PDF</ExportButton>
        </div>
      </div>
    </div>
  );
};

// SVG Icons (Heroicons)
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM9 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6H6a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1v-1a1 1 0 011-1zm6-10a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm10.293 3.293a1 1 0 00-1.414 0L9 11.586l-1.879-1.88a1 1 0 10-1.414 1.415l2.5 2.5a1 1 0 001.414 0l4.086-4.086a1 1 0 000-1.414z" clipRule="evenodd" />
  </svg>
);

const DocumentSearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    <path d="M12.5 14.5a1 1 0 100-2 1 1 0 000 2z" />
    <path d="M14.207 13.207a1 1 0 00-1.414 1.414l1.5 1.5a1 1 0 001.414-1.414l-1.5-1.5z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const PrinterIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h8a1 1 0 011 1v4h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
</svg>
);


export default ActionToolbar;