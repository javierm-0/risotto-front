// src/utils/pdfGenerator.ts
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';


// Importa tus imágenes. Asegúrate de que las rutas sean correctas
import logoUniversidad from '../assets/logo_ucn.png';
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
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine); // Añadir la última línea
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
    let currentY = page.getHeight() - margin;
    const textIndent = 20;
    const lineHeight = 14; 

    // --- Cargar e Incrustar Imágenes ---
    let embeddedLogoUniversidad, embeddedLogoEscuela;

    // Ajusta estos valores para controlar el tamaño de los logos
    // Vamos a darle un ancho fijo y calcular la altura para mantener la proporción
    const targetUniLogoWidth = 120; // Ancho deseado para el logo de la universidad (ajusta este)
    let actualUniLogoHeight = 0; // Se calculará después de incrustar

    const targetEscuelaLogoWidth = 80; // Ancho deseado para el logo de la escuela (ajusta este)
    let actualEscuelaLogoHeight = 0; // Se calculará después de incrustar

    try {
        const logoUniversidadBytes = await fetch(logoUniversidad).then(res => res.arrayBuffer());
        embeddedLogoUniversidad = await pdfDoc.embedPng(logoUniversidadBytes);
       
        actualUniLogoHeight = (embeddedLogoUniversidad.height / embeddedLogoUniversidad.width) * targetUniLogoWidth;
    } catch (error) {
        console.warn('No se pudo cargar o incrustar el logo de la universidad:', error);
        embeddedLogoUniversidad = null;
    }

    try {
        const logoEscuelaBytes = await fetch(logoEscuela).then(res => res.arrayBuffer());
        embeddedLogoEscuela = await pdfDoc.embedPng(logoEscuelaBytes);
       
        actualEscuelaLogoHeight = (embeddedLogoEscuela.height / embeddedLogoEscuela.width) * targetEscuelaLogoWidth;
    } catch (error) {
        console.warn('No se pudo cargar o incrustar el logo de la escuela:', error);
        embeddedLogoEscuela = null;
    }

    
    // Posicionar el logo de la universidad en la parte superior izquierda
    if (embeddedLogoUniversidad) {
        page.drawImage(embeddedLogoUniversidad, {
            x: margin,
            y: page.getHeight() - margin - actualUniLogoHeight, 
            width: targetUniLogoWidth,
            height: actualUniLogoHeight,
        });
    }

    // Posicionar el logo de la escuela en la parte superior derecha
    if (embeddedLogoEscuela) {
        page.drawImage(embeddedLogoEscuela, {
            x: page.getWidth() - margin - targetEscuelaLogoWidth, 
            y: page.getHeight() - margin - actualEscuelaLogoHeight, 
            width: targetEscuelaLogoWidth,
            height: actualEscuelaLogoHeight,
        });
    }

    // Ajustar el currentY para que el texto comience debajo de los logos
    const maxLogoContentHeight = Math.max(actualUniLogoHeight, actualEscuelaLogoHeight);
    currentY = page.getHeight() - margin - maxLogoContentHeight - 40; // 40 es un espacio adicional

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

    const diagnosticSummary = diagnosticData.diagnostic.length > 70
        ? `${diagnosticData.diagnostic.substring(0, 67)}...`
        : diagnosticData.diagnostic;

    const titleText2 = `Detalle del Diagnóstico: ${diagnosticSummary}`; // [cite: 1]
    page.drawText(titleText2, {
        x: page.getWidth() / 2 - font.widthOfTextAtSize(titleText2, 18) / 2, // Centrar
        y: currentY,
        font: font,
        size: 18,
        color: textColor,
    });
    currentY -= 40;

    // --- Nombre y Fecha (del DTO) ---
    page.drawText(`Nombre: ${diagnosticData.user_name}`, { // [cite: 1]
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
    page.drawText(`Fecha: ${formattedDate}`, { // [cite: 1]
        x: page.getWidth() - margin - 100,
        y: currentY,
        font: font,
        size: 12,
        color: textColor,
    });
    currentY -= 40;

    // --- Sección "Resultados" ---
    page.drawText('Resultados', { // [cite: 1]
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