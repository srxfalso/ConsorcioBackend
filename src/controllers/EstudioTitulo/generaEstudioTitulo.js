const PDFDocument = require('pdfkit');
const fs = require('node:fs');
const path = require('node:path');

function generarEstudioTitulo(jsonData) {
    return new Promise((resolve, reject) => {
        try {
            // Crear directorio si no existe
            const docsDir = path.join(process.cwd(), 'src', 'docs');
            if (!fs.existsSync(docsDir)) {
                fs.mkdirSync(docsDir, { recursive: true });
            }

            const doc = new PDFDocument({ margin: 50 });
            const filename = `Estudio_de_Titulo_${Date.now()}.pdf`;
            const filePath = path.join(docsDir, filename);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Configuración inicial
            doc.fontSize(10);
            doc.font('Helvetica');

            // ===== PÁGINA 1 =====
            // Encabezado
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text('CLIENTE : ' + jsonData.caratula.cliente, 50, 50);
            doc.text('RUT : ' + jsonData.caratula.rut_cliente, 50, 65);
            
            doc.text('PROPIETARIO : ' + jsonData.caratula.propietarios[0].nombre, 50, 85);
            doc.text('RUT : ' + jsonData.caratula.propietarios[0].rut, 50, 100);
            
            doc.text('PROPIETARIO : ' + jsonData.caratula.propietarios[1].nombre, 50, 120);
            doc.text('RUT : ' + jsonData.caratula.propietarios[1].rut, 50, 135);

            doc.text('INMUEBLE : ' + jsonData.caratula.inmueble, 50, 155);
            doc.text('COMUNA : ' + jsonData.caratula.comuna, 50, 170);
            doc.text('ROL DE AVALUO : ' + jsonData.caratula.rol_avaluo, 50, 185);
            doc.text('TIPO OPERACION : ' + jsonData.caratula.tipo_operacion, 50, 200);
            doc.text('BANCO ACREEDOR : ' + jsonData.caratula.banco_acreedor, 50, 215);
            doc.text('ABOGADO : ' + jsonData.caratula.abogado, 50, 230);

            // Sección I - Singularización, Ubicación y Deslindes
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('I.- SINGULARIZACIÓN, UBICACIÓN Y DESLINDES:', 50, 260);

            doc.fontSize(10).font('Helvetica');
            doc.text('1. Ubicación y Deslindes.-', 50, 280);
            
            const textoUbicacion = jsonData.informe_titulo.I_Singularizacion_Ubicacion_Deslindes;
            doc.text(textoUbicacion, 50, 300, {
                width: 500,
                align: 'justify'
            });

            // Pie de página 1
            doc.fontSize(8).font('Helvetica');
            doc.text('Cristian Mauricio Leyton Guerrero – Abogado. cristianleyton34@gmail.com', 50, 750);

            // ===== PÁGINA 2 =====
            doc.addPage();

            // Sección II - Actual Propietario
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('II.- ACTUAL PROPIETARIO:', 50, 50);

            doc.fontSize(10).font('Helvetica');
            doc.text('1.-Titular.-', 50, 70);
            
            const propietario1 = jsonData.caratula.propietarios[0];
            const propietario2 = jsonData.caratula.propietarios[1];
            
            doc.text(`Doña ${propietario1.nombre} y don ${propietario2.nombre} ` +
                    `adquirieron por título de compraventa.`, 50, 90);

            doc.text('2.-Precio.-', 50, 120);
            doc.text('El precio de la compraventa no consta en los antecedentes.', 50, 140);

            doc.text('3.-Capacidad, Estado Civil o Personería.-', 50, 170);
            doc.text(`Doña ${propietario1.nombre} y don ${propietario2.nombre} ` +
                    `comparecen personalmente y declaran en el título ser ${propietario1.estado_civil} y ${propietario2.estado_civil} respectivamente, ` +
                    `actualmente casados entre si y separados de bienes.`, 50, 190, {
                width: 500,
                align: 'justify'
            });

            doc.text('4.-Inscripción.-', 50, 230);
            doc.text('El título rola inscrito a fojas 4817 vuelta número 6264 del ' +
                    'Registro de Propiedad del Conservador de Bienes Raíces de Puerto ' +
                    'Varas correspondiente al año 2022.', 50, 250);

            doc.text('5.-Bienes Familiares.-', 50, 290);
            doc.text('En la inscripción de dominio No existen anotaciones marginales de', 50, 310);

            // Pie de página 2
            doc.text('Cristian Mauricio Leyton Guerrero – Abogado. cristianleyton34@gmail.com', 50, 750);

            // ===== PÁGINA 3 =====
            doc.addPage();

            doc.text('que se hubiere declarado el inmueble como bien familiar.', 50, 50);

            doc.text('6.-Autorización para enajenar: No Aplica', 50, 80);

            // Sección III - Propietarios Anteriores
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('III.- PROPIETARIOS ANTERIORES:', 50, 110);
            doc.fontSize(10).font('Helvetica');
            doc.text('NO SE INFORMAN POR POLITICAS FISCALÍA', 50, 130);

            // Sección IV - Certificado de Gravámenes y Prohibiciones
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('IV.- CERTIFICADO DE GRAVÁMENES Y PROHIBICIONES:', 50, 160);
            doc.fontSize(10).font('Helvetica');
            
            const gravamenes = jsonData.informe_titulo.IV_Certificado_Gravamenes_Prohibiciones;
            doc.text(gravamenes, 50, 180, {
                width: 500,
                align: 'justify'
            });

            // Sección V - Otros Antecedentes
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('V.- OTROS ANTECEDENTES:', 50, 350);
            doc.fontSize(10).font('Helvetica');
            
            doc.text('1.- Afectación a Utilidad Pública:', 50, 370);
            doc.text('MUNICIPAL: Certificado acredita que el inmueble NO se encuentra afecto a expropiación.', 50, 390);
            doc.text('SERVIU: Certificado acredita que el inmueble NO está afecto a expropiación.', 50, 410);

            doc.text('2.- Impuesto Territorial', 50, 440);
            doc.text('Certificado de deuda de contribuciones acredita que a la fecha el inmueble no tiene deudas.', 50, 460);

            doc.text('3.- Vivienda Social', 50, 490);
            doc.text('N/A', 50, 510);

            // Pie de página 3
            doc.text('Cristian Mauricio Leyton Guerrero – Abogado. cristianleyton34@gmail.com', 50, 750);

            // ===== PÁGINA 4 =====
            doc.addPage();

            doc.text('4.- Derechos de Aseo', 50, 50);
            doc.text('N/A', 50, 70);

            doc.text('5.- Certificados de Estado Civil:', 50, 100);
            doc.text('Solicitante: Acreditan ser casados entre si y separados de bienes ' +
                    'de acuerdo a certificado de matrimonio tenido a la vista.', 50, 120);

            // Sección VI - Observaciones
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('VI.- OBSERVACIONES:', 50, 160);
            doc.fontSize(10).font('Helvetica');
            
            const observaciones = jsonData.informe_titulo.VI_Observaciones;
            doc.text(observaciones, 50, 180, {
                width: 500,
                align: 'justify'
            });

            doc.text('Insertar en Escrituras:', 50, 300);
            doc.text('x Certificado de matrimonio vendedor.', 50, 320);
            doc.text('x Certificado de deudas de contribuciones.', 50, 340);

            // Sección VII - Conclusiones
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('VII.- CONCLUSIONES:', 50, 380);
            doc.fontSize(10).font('Helvetica');
            
            const conclusiones = jsonData.informe_titulo.VII_Conclusiones;
            doc.text(conclusiones, 50, 400, {
                width: 500,
                align: 'justify'
            });

            // Fecha actual en formato chileno
            const fecha = new Date();
            const fechaChilena = fecha.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            doc.text('Santiago, ' + fechaChilena, 50, 550);

            // Pie de página final
            doc.text('Gestiona ideas : – AI. soporte@gestionaideas.cl', 50, 750);

            doc.end();

            stream.on('finish', () => {
                resolve({
                    filename: filename,
                    filePath: filePath,
                    message: 'PDF generado exitosamente en /src/docs/'
                });
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

// Función auxiliar para verificar si el directorio existe
function verificarDirectorio() {
    const docsDir = path.join(process.cwd(), 'src', 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
        console.log('Directorio /src/docs creado exitosamente');
    }
    return docsDir;
}



module.exports = { generarEstudioTitulo, verificarDirectorio };