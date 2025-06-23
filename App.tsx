
import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData, TemplateId, CustomizationOptions, PersonalDetails, WorkExperience, Education, Skill, CustomSection, ModalContentType, ResumeSection } from './types';
import { INITIAL_RESUME_DATA, INITIAL_CUSTOMIZATION_OPTIONS, GEMINI_API_KEY_ERROR_MESSAGE, GEMINI_GENERAL_ERROR_MESSAGE } from './constants';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import CustomizationPanel from './components/CustomizationPanel';
import ActionToolbar from './components/ActionToolbar';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/Modal';
import { generateResumeContent, getKeywordsSuggestion, getATSAdvice, getJobMatchAnalysis } from './services/geminiService';
import { exportToHTML, exportToPDF } from './services/exportService';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>(INITIAL_CUSTOMIZATION_OPTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContentType | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const handleUpdatePersonalDetails = useCallback((details: Partial<PersonalDetails>) => {
    setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, ...details } }));
  }, []);

  const handleUpdateSection = useCallback(<K extends keyof ResumeData, V extends ResumeData[K],>(section: K, value: V) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  }, []);

  const handleAddItem = useCallback(
    <S extends keyof Pick<ResumeData, 'experience' | 'education' | 'skills' | 'customSections'>,>(
      section: S,
      newItemData: Omit<ResumeData[S][number], 'id'>
    ) => {
      setResumeData(prev => {
        const currentSectionArray = prev[section]; // Type is ResumeData[S] (e.g., WorkExperience[])
        // Explicitly type newItemWithId to ensure it matches the specific item type of the section's array.
        const newItemWithId = { ...newItemData, id: uuidv4() } as ResumeData[S][number];
        return {
          ...prev,
          // currentSectionArray is already correctly typed (e.g., WorkExperience[]), newItemWithId matches its element type.
          [section]: [...currentSectionArray, newItemWithId],
        };
      });
    },
    []
  );

  const handleUpdateItem = useCallback(
    <S extends keyof Pick<ResumeData, 'experience' | 'education' | 'skills' | 'customSections'>,>(
      section: S,
      updatedItem: ResumeData[S][number] // updatedItem is already the specific type (e.g., WorkExperience)
    ) => {
      setResumeData(prev => {
        // prev[section] is ResumeData[S]. Cast to specific array type for map operation to ensure item is also specific.
        const specificArray = prev[section] as ResumeData[S][number][];
        return {
          ...prev,
          [section]: specificArray.map(item => // item is now ResumeData[S][number] (e.g. WorkExperience)
            item.id === updatedItem.id ? updatedItem : item
          ), // The result of map is ResumeData[S][number][]
        };
      });
    },
    []
  );

  const handleRemoveItem = useCallback((section: keyof Pick<ResumeData, 'experience' | 'education' | 'skills' | 'customSections'>, itemId: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section] as Array<{id: string}>).filter(item => item.id !== itemId),
    }));
  }, []);
  
  const handleCustomizationChange = useCallback((options: Partial<CustomizationOptions>) => {
    setCustomizationOptions(prev => ({ ...prev, ...options }));
  }, []);

  const handleGenerateWithAI = async (section: ResumeSection, context?: string, itemId?: string) => {
    setIsLoading(true);
    setModalContent(null);
    try {
      const { fullName, email } = resumeData.personalDetails; // For context
      const industry = prompt("Enter your industry (e.g., Software Engineering, Marketing):") || "general";
      const role = prompt("Enter your target job role (e.g., Senior Developer, Product Manager):") || "professional";
      
      let promptText = `Generate content for resume section: ${section}. `;
      if (context) promptText += `Context: ${context}. `;
      promptText += `Industry: ${industry}, Role: ${role}. Candidate: ${fullName}, ${email}.`;
      if (section === 'summary') promptText += ` Focus on a professional summary.`
      if (section === 'experienceItem' && itemId) {
        const exp = resumeData.experience.find(e => e.id === itemId);
        promptText += ` For job title: ${exp?.jobTitle} at ${exp?.company}. Generate 3-5 impactful bullet points.`;
      }


      const generatedText = await generateResumeContent(promptText, resumeData);
      if (!generatedText) throw new Error("No content generated.");

      if (section === 'summary') {
        setResumeData(prev => ({ ...prev, summary: generatedText }));
      } else if (section === 'experienceItem' && itemId) {
        setResumeData(prev => ({
          ...prev,
          experience: prev.experience.map(exp => 
            exp.id === itemId ? { ...exp, responsibilities: generatedText.split('\\n').map(s=>s.replace(/^- /,'').trim()).filter(Boolean) } : exp
          )
        }));
      }
      // Add more section handling as needed
      
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = (error as Error).message === GEMINI_API_KEY_ERROR_MESSAGE ? GEMINI_API_KEY_ERROR_MESSAGE : GEMINI_GENERAL_ERROR_MESSAGE;
      setModalContent({ title: 'Error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizeKeywords = async () => {
    setIsLoading(true);
    setModalContent(null);
    try {
      const industry = prompt("Enter your industry for keyword optimization:") || "general";
      const role = prompt("Enter your target job role:") || "professional";
      const keywords = await getKeywordsSuggestion(JSON.stringify(resumeData), industry, role);
      setModalContent({ title: 'Keyword Suggestions', content: <div className="whitespace-pre-wrap">{keywords}</div> });
    } catch (error) {
      console.error("Keyword Optimization Error:", error);
      const errorMessage = (error as Error).message === GEMINI_API_KEY_ERROR_MESSAGE ? GEMINI_API_KEY_ERROR_MESSAGE : GEMINI_GENERAL_ERROR_MESSAGE;
      setModalContent({ title: 'Error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleATSCheck = async () => {
    setIsLoading(true);
    setModalContent(null);
    try {
      const industry = prompt("Enter your industry for ATS advice:") || "general";
      const role = prompt("Enter your target job role:") || "professional";
      const advice = await getATSAdvice(industry, role);
      setModalContent({ title: 'ATS Compatibility Advice', content: <div className="whitespace-pre-wrap">{advice}</div> });
    } catch (error)
      {
      console.error("ATS Check Error:", error);
      const errorMessage = (error as Error).message === GEMINI_API_KEY_ERROR_MESSAGE ? GEMINI_API_KEY_ERROR_MESSAGE : GEMINI_GENERAL_ERROR_MESSAGE;
      setModalContent({ title: 'Error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJobMatchAnalysis = async () => {
    if (!jobDescription.trim()) {
      setModalContent({ title: 'Job Description Missing', content: 'Please paste the job description first.' });
      return;
    }
    setIsLoading(true);
    setModalContent(null);
    try {
      const analysis = await getJobMatchAnalysis(JSON.stringify(resumeData), jobDescription);
      setModalContent({ title: 'Job Description Match Analysis', content: <div className="whitespace-pre-wrap">{analysis}</div> });
    } catch (error) {
      console.error("Job Match Analysis Error:", error);
      const errorMessage = (error as Error).message === GEMINI_API_KEY_ERROR_MESSAGE ? GEMINI_API_KEY_ERROR_MESSAGE : GEMINI_GENERAL_ERROR_MESSAGE;
      setModalContent({ title: 'Error', content: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'pdf' | 'html') => {
    if (!resumePreviewRef.current) return;
    if (format === 'html') {
      exportToHTML(resumePreviewRef.current.innerHTML, `${resumeData.personalDetails.fullName}_Resume.html`);
    } else if (format === 'pdf') {
      setIsLoading(true); // Show loader for PDF generation as it can take time
      exportToPDF(resumePreviewRef.current, `${resumeData.personalDetails.fullName}_Resume.pdf`)
        .then(() => setIsLoading(false))
        .catch(err => {
          console.error("PDF Export Error:", err);
          setModalContent({ title: 'PDF Export Error', content: 'Failed to generate PDF. Please try HTML export or ensure your browser supports printing to PDF and pop-ups are allowed for this site.' });
          setIsLoading(false);
        });
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      {isLoading && <LoadingSpinner />}
      {modalContent && (
        <Modal title={modalContent.title} onClose={() => setModalContent(null)}>
          {modalContent.content}
          {modalContent.actions && <div className="mt-4 flex justify-end space-x-3">{modalContent.actions}</div>}
        </Modal>
      )}

      <aside className="w-full md:w-2/5 lg:w-1/3 p-6 bg-white md:shadow-xl overflow-y-auto h-screen max-h-screen no-print">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">AI Resume Architect</h1>
        <CustomizationPanel
          options={customizationOptions}
          onChange={handleCustomizationChange}
        />
        <ResumeForm
          resumeData={resumeData}
          onUpdatePersonalDetails={handleUpdatePersonalDetails}
          onUpdateSection={handleUpdateSection}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onGenerateAI={handleGenerateWithAI}
        />
      </aside>

      <main className="w-full md:w-3/5 lg:w-2/3 p-6 flex flex-col h-screen max-h-screen">
        <ActionToolbar
          onOptimizeKeywords={handleOptimizeKeywords}
          onATSCheck={handleATSCheck}
          onJobMatchAnalysis={() => {
            setModalContent({
              title: 'Job Description Match Analysis',
              content: (
                <textarea
                  className="w-full h-40 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  aria-label="Job Description Input"
                />
              ),
              actions: (
                <button
                  onClick={() => {
                     setModalContent(null); // Close current modal before opening analysis
                     // Brief delay to ensure modal is closed before starting analysis
                     setTimeout(handleJobMatchAnalysis, 50);
                    }
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-150"
                  aria-label="Analyze Job Description"
                >
                  Analyze
                </button>
              )
            });
          }}
          onExport={handleExport}
        />
        <div className="flex-grow bg-slate-200 p-4 overflow-auto rounded-lg shadow-inner mt-4">
          <ResumePreview
            ref={resumePreviewRef}
            resumeData={resumeData}
            options={customizationOptions}
          />
        </div>
      </main>
    </div>
  );
};

export default App;