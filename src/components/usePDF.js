import { useRef } from "react";
import html2pdf from "html2pdf.js";

const usePDF = () => {
  const elementRef = useRef();

  const generatePDF = ({
    filename = "document.pdf",
    orientation = "portrait",
  } = {}) => {
    if (!elementRef.current) {
      console.error("No element reference provided for PDF generation.");
      return;
    }

    const options = {
      margin: 1,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation },
    };

    html2pdf().from(elementRef.current).set(options).save();
  };

  return { elementRef, generatePDF };
};

export default usePDF;
