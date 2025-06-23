
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToHTML = (content: string, fileName: string): void => {
  const blob = new Blob([`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${fileName.replace('.html', '')}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        /* Add any template-specific print styles here if needed, or ensure they are in the content */
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = async (element: HTMLElement, fileName: string): Promise<void> => {
  const originalTitle = document.title;
  document.title = fileName.replace('.pdf', ''); // Suggest filename for PDF

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0px'; // Keep it hidden
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden'; // Ensure it's not visible
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    document.title = originalTitle;
    throw new Error('Could not create iframe for printing. Ensure pop-ups are allowed.');
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${fileName.replace('.pdf', '')}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #resume-preview-content, .resume-preview-content-class { /* Use a class if ID might conflict */
             margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; 
             width: 100% !important; max-width: 100% !important; height: auto !important; min-height: initial !important;
             page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
    </body>
    </html>
  `);
  iframeDoc.close();
  
  // Clone stylesheets from the main document to the iframe
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      if (sheet.href) { // For <link> stylesheets
        const link = iframeDoc.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = sheet.href;
        iframeDoc.head.appendChild(link);
      } else if (sheet.cssRules) { // For inline <style> tags
        const style = iframeDoc.createElement('style');
        Array.from(sheet.cssRules).forEach(rule => {
          style.appendChild(iframeDoc.createTextNode(rule.cssText));
        });
        iframeDoc.head.appendChild(style);
      }
    } catch (e) {
      // Catch potential security errors if CSS rules can't be accessed (e.g., cross-origin)
      console.warn("Could not clone stylesheet for printing:", sheet.href || 'inline style', e);
    }
  });
  
  // A delay to allow styles (especially Tailwind JIT) to load and apply in the iframe
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  const clonedElement = element.cloneNode(true) as HTMLElement;
  // If element uses ID for styling, ensure it's unique or use classes
  // For this app, 'resume-preview-content' is the ID.
  // clonedElement.className = `${clonedElement.className} resume-preview-content-class`; // Example if class based styling preferred for print isolation

  iframeDoc.body.innerHTML = ''; // Clear any previous body content
  iframeDoc.body.appendChild(clonedElement);
  
  if (iframe.contentWindow) {
    iframe.contentWindow.focus(); // Focus is important for print command
    iframe.contentWindow.print();
  } else {
    console.error("Cannot access iframe content window for printing.");
    // Fallback or error message to user
  }

  // Cleanup: remove iframe after a delay. Some browsers need it longer for print dialog.
  setTimeout(() => {
    document.body.removeChild(iframe);
    document.title = originalTitle; // Restore original document title
  }, 3000); // Increased delay for safety
  

  // html2canvas fallback logic remains commented out as per original structure
  // const canvas = await html2canvas(element, { /* ...options... */ });
  // const imgData = canvas.toDataURL('image/png');
  // const pdf = new jsPDF({ /* ...options... */ });
  // pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
  // pdf.save(fileName);
};
