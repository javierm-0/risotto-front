// src/utils/pdfGenerator.ts
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

import logoUniversidad from '../assets/Escudo-UCN-Full-Color (1).png';
import logoEscuela from '../assets/logoMedUcn_circular.png';
/**
 * Función auxiliar para dividir texto en líneas que encajen en un ancho dado.
 * @param {string} text - El texto a dividir.
 * @param {PDFFont} font - La fuente a usar.
 * @param {number} fontSize - El tamaño de la fuente.
 * @param {number} maxWidth - El ancho máximo permitido para cada línea.
 * @returns {string[]} Un array de strings, donde cada string es una línea.
 */
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth < maxWidth) {
            currentLine = testLine; 
            lines.push(currentLine); 
            currentLine = word; 
        }
    }
    lines.push(currentLine);
    return lines;
}

/**
 * Función para generar el PDF en el frontend con imágenes y texto ajustado.
 * @param {pdfDiagnosticDto} diagnosticData - Los datos del diagnóstico recibidos del backend.
 */
export async function generatePdfInFrontend(diagnosticData: pdfDiagnosticDto): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textColor = rgb(0, 0, 0);

    const margin = 50;
   
    let currentY: number;
    const textIndent = 20;
    const lineHeight = 14;
    const logoMarginBottom = 20; 

    
    let embeddedLogoUniversidad, embeddedLogoEscuela;

  
    const targetLogoWidth = 90; 
    let actualLogoHeight = 0; 

    try {
        const logoUniversidadBytes = await fetch(logoUniversidad).then(res => res.arrayBuffer());
        embeddedLogoUniversidad = await pdfDoc.embedPng(logoUniversidadBytes);
        actualLogoHeight = (embeddedLogoUniversidad.height / embeddedLogoUniversidad.width) * targetLogoWidth;
    } catch (error) {
        console.warn('No se pudo cargar o incrustar el logo de la universidad:', error);
        embeddedLogoUniversidad = null;
    }

    try {
        const logoEscuelaBytes = await fetch(logoEscuela).then(res => res.arrayBuffer());
        embeddedLogoEscuela = await pdfDoc.embedPng(logoEscuelaBytes);
       
        
    } catch (error) {
        console.warn('No se pudo cargar o incrustar el logo de la escuela:', error);
        embeddedLogoEscuela = null;
    }

    // --- Dibujar Imágenes (si se cargaron) ---
    if (embeddedLogoUniversidad) {
        page.drawImage(embeddedLogoUniversidad, {
            x: margin,
            y: page.getHeight() - margin - actualLogoHeight,
            width: targetLogoWidth,
            height: actualLogoHeight,
        });
    }

    if (embeddedLogoEscuela) {
        page.drawImage(embeddedLogoEscuela, {
            x: page.getWidth() - margin - targetLogoWidth,
            y: page.getHeight() - margin - actualLogoHeight,
            width: targetLogoWidth,
            height: actualLogoHeight,
        });
    }

 
    currentY = page.getHeight() - margin - actualLogoHeight - logoMarginBottom; 

    // --- Encabezado ---
    const titleText1 = 'Resultados de la Simulación';
    page.drawText(titleText1, {
        x: page.getWidth() / 2 - boldFont.widthOfTextAtSize(titleText1, 24) / 2, // Centrar
        y: currentY,
        font: boldFont,
        size: 24,
        color: textColor,
    });
    currentY -= 30;
    const maxWidthForDiagnosticTitle = page.getWidth() - (2 * margin); 
    const diagnosticTitleFontSize = 18; 
   
    const diagnosticFullText = `Detalle del Diagnóstico: ${diagnosticData.diagnostic}`;
    const wrappedDiagnosticLines = wrapText(diagnosticFullText, font, diagnosticTitleFontSize, maxWidthForDiagnosticTitle);

    for (const line of wrappedDiagnosticLines) {
        page.drawText(line, {
            x: page.getWidth() / 2 - font.widthOfTextAtSize(line, diagnosticTitleFontSize) / 2, 
            font: font,
            size: diagnosticTitleFontSize,
            color: textColor,
        });
        currentY -= (diagnosticTitleFontSize + 5); 
    }
    
    currentY -= 10; 

    // --- Nombre y Fecha (del DTO) ---
    page.drawText(`Nombre: ${diagnosticData.user_name}`, {
        x: margin,
        y: currentY,
        font: font,
        size: 12,
        color: textColor,
    });

    const dateObj = typeof diagnosticData.date === 'string'
        ? new Date(diagnosticData.date)
        : diagnosticData.date;

    const formattedDate = dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    page.drawText(`Fecha: ${formattedDate}`, {
        x: page.getWidth() - margin - 100,
        y: currentY,
        font: font,
        size: 12,
        color: textColor,
    });
    currentY -= 40;

    // --- Sección "Resultados" ---
    page.drawText('Resultados', {
        x: margin,
        y: currentY,
        font: boldFont,
        size: 16,
        color: textColor,
    });
    currentY -= 20;

    // --- Detalles del Diagnóstico (del DTO) ---
    const drawWrappedKeyValue = (key: string, value: string, textX: number, contentX: number, maxWidth: number) => {
        page.drawText(`${key}:`, {
            x: textX,
            y: currentY,
            font: boldFont,
            size: 12,
            color: textColor,
        });
        currentY -= lineHeight;

        const lines = wrapText(value, font, 12, maxWidth);
        for (const line of lines) {
            page.drawText(line, {
                x: contentX,
                y: currentY,
                font: font,
                size: 12,
                color: textColor,
            });
            currentY -= lineHeight;
        }
        currentY -= lineHeight * 0.5;
    };

    const contentWidth = page.getWidth() - (margin + margin + textIndent + 60);

    drawWrappedKeyValue('Diagnóstico', diagnosticData.diagnostic, margin + textIndent, margin + textIndent + 60, contentWidth);
    drawWrappedKeyValue('Respuesta del Estudiante', diagnosticData.case_info, margin + textIndent, margin + textIndent + 60, contentWidth);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Solo la descarga, sin abrir ventana nueva
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados_simulacion_${diagnosticData.diagnostic}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * DTO para los datos del diagnóstico.
 */
export interface pdfDiagnosticDto {
    user_id: string; // ID del usuario
    user_name: string; // Nombre del usuario (opcional)
    case_id: string; // ID del caso
    diagnostic: string; // Diagnóstico del caso
    case_info: string; // Información adicional del caso
    date: Date | string; // Fecha del diagnóstico, puede ser Date o ISO string
}