// src/components/PdfTestViewer.tsx (o dentro de App.tsx)
import React from 'react';
import { generatePdfInFrontend } from '../utils/pdfGenerator';
import { pdfDiagnosticDto } from '../utils/pdfGenerator';
const PdfTestViewer: React.FC = () => {
   
    const testDiagnosticData: pdfDiagnosticDto = {
        user_id: 'TEST_USER_1231313',
        case_id: 'TEST_CASE_X123131YZ',
        user_name: 'Juan Pérez',
        diagnostic: 'Ingreso por Neumonía en Paciente con Secuelas de ACV',
        case_info: 'Aquí va la información del caso de prueba. También puede ser un texto más extenso para simular contenido real y probar la visualización del diseño del PDF. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        date: new Date().toISOString() 
    };

    const handleGenerateTestPdf = async () => {
        try {
           
            await generatePdfInFrontend(testDiagnosticData);
            console.log('PDF de prueba generado y abierto en una nueva pestaña.');
        } catch (error) {
            console.error('Error al generar el PDF de prueba:', error);
            alert('Hubo un error al generar el PDF de prueba. Revisa la consola.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Myriad Pro, Arial, sans-serif' }}>
            <h1 style={{ fontFamily: 'Myriad Pro, Arial, sans-serif' }}>Generador de PDF de Prueba</h1>
            <p style={{ fontFamily: 'Myriad Pro, Arial, sans-serif' }}>Haz clic en el botón para generar un PDF de prueba con datos simulados y ver el diseño.</p>
            
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontFamily: 'Myriad Pro, Arial, sans-serif' }}>
                <h2 style={{ fontFamily: 'Myriad Pro, Arial, sans-serif' }}>Datos de Prueba (JSON)</h2>
                <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px', overflowX: 'auto', fontFamily: 'Myriad Pro, monospace' }}>
                    <code>{JSON.stringify(testDiagnosticData, null, 2)}</code>
                </pre>
            </div>

            <button
                onClick={handleGenerateTestPdf}
                style={{
                    padding: '12px 25px',
                    fontSize: '18px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    fontFamily: 'Myriad Pro, Arial, sans-serif'
                }}
            >
                Generar y Visualizar PDF de Prueba
            </button>
        </div>
    );
};

export default PdfTestViewer;