
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex flex-col items-center justify-center z-50 no-print" role="alert" aria-live="assertive">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="mt-4 text-white text-lg font-medium">Processing...</p>
    </div>
  );
};

export default LoadingSpinner;