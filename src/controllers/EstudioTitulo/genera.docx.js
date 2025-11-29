const { Document, Paragraph, TextRun, AlignmentType, PageNumber, Footer, Packer } = require('docx');
const fs = require('node:fs');
const path = require('node:path');
// Función para formatear la fecha actual
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Función para crear el documento
async function createWordDocument(jsonData, solicitud_id) {
    
     const outputDir = path.join(__dirname, '../../docs/gestion_docs/',solicitud_id.toString());
                        
    // Configuración de fuentes
    const fontStyle = {
        font: "Courier New",
        size: 12,
    };

    const titleFontStyle = {
        font: "Courier New",
        size: 14,
        bold: true,
    };

    const headerFontStyle = {
        font: "Courier New",
        size: 12,
        bold: true,
    };

    // Extraer datos del JSON para la carátula
    const caratula = jsonData.caratula;
    const propietarios = caratula.propietarios;

    // Crear contenido del documento
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1000,
                            right: 1000,
                            bottom: 1000,
                            left: 1000,
                        },
                    },
                },
                children: [
                    // Título centrado
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "INFORME DE TITULO",
                                ...titleFontStyle,
                                size: 16,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    
                    // Carátula - usando datos del JSON
                    new Paragraph({
                        children: [
                            new TextRun({ text: "CLIENTE", ...headerFontStyle }),
                            new TextRun({ text: "\t\t\t: " + caratula.cliente, ...fontStyle }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "RUT", ...headerFontStyle }),
                            new TextRun({ text: "\t\t\t\t\t: " + caratula.rut_cliente, ...fontStyle }),
                        ],
                    }),
                    
                    // Propietarios - dinámicos desde el JSON
                    ...propietarios.flatMap((propietario, index) => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "PROPIETARIO", ...headerFontStyle }),
                                new TextRun({ text: `\t\t: ${propietario.nombre}`, ...fontStyle }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: "RUT", ...headerFontStyle }),
                                new TextRun({ text: `\t\t\t\t\t: ${propietario.rut}`, ...fontStyle }),
                            ],
                        }),
                    ]),
                    
                    // Inmueble - formateado según solicitud
                    new Paragraph({
                        children: [
                            new TextRun({ text: "INMUEBLE", ...headerFontStyle }),
                            new TextRun({ text: "\t\t: Decher 540, Dp 208, Bd 4, Bx 7", ...fontStyle }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "COMUNA", ...headerFontStyle }),
                            new TextRun({ text: "\t\t\t: " + caratula.comuna, ...fontStyle }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "ROL DE AVALUO", ...headerFontStyle }),
                            new TextRun({ text: "\t: " + caratula.rol_avaluo.replace(/;/g, ','), ...fontStyle }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "TIPO OPERACION", ...headerFontStyle }),
                            new TextRun({ text: "\t: REF EXTERNO", ...fontStyle }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "BANCO ACREEDOR", ...headerFontStyle }),
                            new TextRun({ text: "\t: BANCO DE CHILE", ...fontStyle }),
                        ],
                    }),
                                        
                    // Línea separadora
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "____________________________________________________________________________________",
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    
                    // Sección I
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "I. INDIVIDUALIZACIÓN DE LOS COMPARECIENTES",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.I_INDIVIDUALIZACIÓN_DE_LOS_COMPARECIENTES,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección II
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. CERTIFICADO DE MATRIMONIO",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.II_CERTIFICADO_DE_MATRIMONIO,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección III
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "III. COMPROBANTE DE DEUDA DE ALIMENTOS",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.III_CERTIFICADO_DEUDA_DE_ALIMENTOS,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección IV
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "IV. CONTRIBUCIONES",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.IV_CONTRIBUCIONES,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección V
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "V. AFECTACIÓN PÚBLICA",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.V_AFECTACIÓN_PÚBLICA,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección VI
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "VI. CERTIFICADO DE HIPOTECAS, GRAVÁMENES, PROHIBICIONES E INTERDICCIONES",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.VI_HIPOTECAS_GRAVÁMENES_PROHIBICIONES_E_INTERDICCIONES,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    
                    // Espacio
                    new Paragraph({ text: "" }),
                    
                    // Sección VII
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "VII. DOMINIO VIGENTE",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.VII_DOMINIO_VIGENTE,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    
                    // Sección VII
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "VIII. INFORME DE SITUACIÓN DEL INMUEBLE SERVIU",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.VIII_INFORME_DE_SITUACIÓN_DEL_INMUEBLE_SERVIU,
                                ...fontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    
                    // Sección VII
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "IX. CONCLUSIONES",
                                ...titleFontStyle,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: jsonData.informe_titulo.IX_CONCLUSIONES,
                                ...fontStyle,
                            }),
                        ],
                    }),
                ],
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `gestionaideas.com + ${getCurrentDateTime()}`,
                                        ...fontStyle,
                                        size: 10,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
            },
        ],
    });

    // Generar el documento
    const buffer = await Packer.toBuffer(doc);
    
    // Guardar el archivo
    const pathdocx= path.join(outputDir, `Informe_de_Titulo_${solicitud_id.toString()}.docx`);
    fs.writeFileSync(pathdocx, buffer);
    console.log(`Documento Word generado exitosamente: ${pathdocx}`);
    return pathdocx;
}

// Instalar las dependencias necesarias:
// npm install docx

// Ejecutar la función
//createWordDocument().catch(console.error);
module.exports = { createWordDocument };