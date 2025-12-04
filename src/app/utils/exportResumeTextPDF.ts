// "use client";
// import jsPDF from "jspdf";

// function sanitizeUnsupportedColors(root: HTMLElement) {
//   const elements = root.querySelectorAll<HTMLElement>("*");
//   elements.forEach((el) => {
//     const s = getComputedStyle(el);
//     el.style.color = s.color;
//     el.style.backgroundColor = s.backgroundColor;
//     el.style.borderColor = s.borderColor;
//   });
// }

// export async function exportResumeTextPDF(resumeRef: React.RefObject<HTMLDivElement | null>) {
//   if (typeof window === "undefined") return;
//   if (!resumeRef.current) return;

//   sanitizeUnsupportedColors(resumeRef.current);

//   const resume = resumeRef.current;
//   resume.style.width = "794px";
//   resume.style.margin = "0 auto";
//   resume.style.backgroundColor = "#fff";
//   resume.style.boxSizing = "border-box";

//   // ✅ Add CSS for clean page breaks
//   const style = document.createElement("style");
//   style.innerHTML = `
//     @media print {
//       .page-break { page-break-before: always; }
//       * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
//     }
//   `;
//   document.head.appendChild(style);

//   // ✅ jsPDF instance
//   const pdf = new jsPDF({
//     unit: "px",
//     format: "a4",
//     orientation: "portrait",
//   });

//   await pdf.html(resume, {
//     x: 0,
//     y: 0,
//     html2canvas: {
//       scale: 1,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//       scrollX: 0,
//       scrollY: 0,
//       windowWidth: 794,
//     },
//     autoPaging: "text", // ensures long content continues properly
//     callback: function (pdf) {
//       pdf.save("resume.pdf");
//       style.remove();
//     },
//   });
// }
export function PrintResume(resumeRef: React.RefObject<HTMLDivElement | null>) {
  if (!resumeRef.current) return;

  // clone node to a printable container
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Resume</title>
        <style>
          @page { size: A4; margin: 0.5in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff; }
          ${Array.from(document.styleSheets)
            .map((s) => {
              try {
                return Array.from(s.cssRules || [])
                  .map((r) => r.cssText)
                  .join("");
              } catch {
                return "";
              }
            })
            .join("")}
        </style>
      </head>
      <body>${resumeRef.current.outerHTML}</body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // open system print dialog – user can choose "Save as PDF"
  printWindow.print();
}
