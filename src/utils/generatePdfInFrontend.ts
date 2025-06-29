import jsPDF from 'jspdf';

export type pdfDiagnosticDto = {
  case_id: string;
  user_name: string;
  case_info: string;
  date: string;
  case_title: string;
  logos?: {
    ucn: string;
    medicina: string;
  };
};

export async function generatePdfInFrontend(data: pdfDiagnosticDto) {
  const doc = new jsPDF();

  const logoUCN = data.logos?.ucn || '/logos/Escudo-UCN-Full-Color.png';
  const logoMed = data.logos?.medicina || '/logos/logoMedUcn_circular.png';

  const ucnImg = new Image();
  const medImg = new Image();
  const logoSize = 35;

  const cargarImagen = (img: HTMLImageElement, src: string) =>
    new Promise((resolve, reject) => {
      img.src = src;
      img.onload = () => resolve(true);
      img.onerror = () => reject(`No se pudo cargar la imagen: ${src}`);
    });

  try {
    await Promise.all([
      cargarImagen(ucnImg, logoUCN),
      cargarImagen(medImg, logoMed),
    ]);
    doc.addImage(ucnImg, 'PNG', 15, 10, logoSize, logoSize);
    doc.addImage(medImg, 'PNG', 160, 10, logoSize, logoSize);
  } catch (e) {
    console.warn(e);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Resultados de la Simulación', 105, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre del Estudiante: ${data.user_name}`, 20, 60);
  doc.text(`Fecha: ${new Date(data.date).toLocaleDateString('es-CL')}`, 20, 72);
  doc.text(`Título del Caso: ${data.case_title}`, 20, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico Final:', 20, 100);
  doc.setFont('helvetica', 'normal');

  const splitText = doc.splitTextToSize(data.case_info, 170);
  doc.text(splitText, 20, 110);

  // 🎯 Nombre de archivo más único y descriptivo
  const nombre = data.user_name.toLowerCase().replace(/\s+/g, '_');
  const fecha = new Date(data.date).toLocaleDateString('es-CL').replace(/\//g, '-');
  const titulo = data.case_title.toLowerCase().replace(/\s+/g, '_').substring(0, 30);

  doc.save(`diagnostico_${nombre}_${titulo}_${fecha}.pdf`);
}
