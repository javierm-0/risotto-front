import jsPDF from 'jspdf';
import ucnLogo from '../assets/Escudo-UCN-Full-Color.png';
import medicinaLogo from '../assets/logoMedUcn_circular.png';

export type pdfDiagnosticDto = {
  case_id: string;
  user_name: string;
  case_info: string;
  date: string;
  logos?: {
    ucn: string;
    medicina: string;
  };
};

export async function generatePdfInFrontend(data: pdfDiagnosticDto) {
  const doc = new jsPDF();

  // Logos
  const logoUCN = data.logos?.ucn || ucnLogo;
  const logoMed = data.logos?.medicina || medicinaLogo;

  const logoSize = 35;

  const ucnImg = new Image();
  ucnImg.src = logoUCN;

  const medImg = new Image();
  medImg.src = logoMed;

  await Promise.all([
    new Promise((res) => (ucnImg.onload = res)),
    new Promise((res) => (medImg.onload = res)),
  ]);

  doc.addImage(ucnImg, 'PNG', 15, 10, logoSize, logoSize);
  doc.addImage(medImg, 'PNG', 160, 10, logoSize, logoSize);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Resultados de la Simulación', 105, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre del Estudiante: ${data.user_name}`, 20, 60);
  doc.text(`Fecha: ${new Date(data.date).toLocaleDateString()}`, 20, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico Final:', 20, 100);
  doc.setFont('helvetica', 'normal');

  const splitText = doc.splitTextToSize(data.case_info, 170);
  doc.text(splitText, 20, 110);

  doc.save(`diagnostico_final_${data.case_id}.pdf`);
}
