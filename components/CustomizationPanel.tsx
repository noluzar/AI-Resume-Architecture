
import React from 'react';
import { CustomizationOptions, TemplateId, ColorScheme, FontOptions } from '../types';
import { TEMPLATES, INITIAL_COLOR_SCHEMES, FONT_FAMILIES, FONT_SIZES } from '../constants';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: Partial<CustomizationOptions>) => void;
}

const SelectField: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: {name: string, value: string}[]; selectId: string;}> = ({ label, value, onChange, options, selectId }) => (
  <div className="mb-4">
    <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={selectId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.name}</option>
      ))}
    </select>
  </div>
);


const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ options, onChange }) => {
  const handleTemplateChange = (templateId: TemplateId) => {
    onChange({ templateId });
  };

  const handleColorSchemeChange = (schemeName: string) => {
    const selectedScheme = INITIAL_COLOR_SCHEMES[schemeName] || INITIAL_COLOR_SCHEMES.default;
    onChange({ colorScheme: selectedScheme });
  };
  
  const handleFontFamilyChange = (fontFamily: string) => {
    onChange({ fontOptions: { ...options.fontOptions, fontFamily } });
  };

  const handleFontSizeChange = (fontSize: string) => {
    onChange({ fontOptions: { ...options.fontOptions, fontSize } });
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow bg-white mb-6">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Customize Your Resume</h3>
      
      <SelectField 
        label="Template"
        selectId="template-select"
        value={options.templateId}
        onChange={(value) => handleTemplateChange(value as TemplateId)}
        options={TEMPLATES.map(t => ({ name: t.name, value: t.id }))}
      />
      
      <SelectField 
        label="Color Scheme"
        selectId="color-scheme-select"
        value={options.colorScheme.name || 'default'}
        onChange={handleColorSchemeChange}
        options={Object.entries(INITIAL_COLOR_SCHEMES).map(([key, scheme]) => ({ name: scheme.name || key, value: key }))}
      />

      <SelectField 
        label="Font Family"
        selectId="font-family-select"
        value={options.fontOptions.fontFamily}
        onChange={handleFontFamilyChange}
        options={FONT_FAMILIES}
      />

      <SelectField 
        label="Font Size"
        selectId="font-size-select"
        value={options.fontOptions.fontSize}
        onChange={handleFontSizeChange}
        options={FONT_SIZES}
      />
    </div>
  );
};

export default CustomizationPanel;