const fnc_OpenAi= require('../controllers/OpenAi/files.openAi');
const fnc_fsbinario = require('../controllers/Binarios/files.binarios');
const fnc_estudio_titulo = require('../controllers/EstudioTitulo/generaEstudioTitulo');
const fnc_docx = require('../controllers/EstudioTitulo/genera.docx');
const fnc_sql_procedure= require('../controllers/SQL/procedure.sql');
const fnc_email= require('../utils/sfnc_emailsmtp.utils');

const fnc_logger = require('../utils/logger.utils');
const { DocumentBackground } = require('docx');
const fs = require('node:fs').promises;
const path = require('node:path');

async function updload_files(params) {
    try {
            let solicitud = params.solicitud;
            let lista_docs = params.lista_docs;
            let result_solicitud = await fnc_sql_procedure.sql_insert_solicitud(solicitud);
            solicitud.solicitud_id = result_solicitud.solicitud_id;
            for (const doc of lista_docs) {
                doc.solicitud_id = result_solicitud.solicitud_id;
                const body_binario = {
                    solicitud_id: result_solicitud.solicitud_id,
                    path_gestion: doc.file_tipo_doc,
                    nombre_documento: doc.file_nombre,
                    base64: doc.file_base64
                }
               console.log('body_binario:', body_binario);

               const resultado_binario = await fnc_fsbinario.binario_gestion_doc_pdf(body_binario);
               console.log('resultado_binario:', resultado_binario);
               if (resultado_binario.success) {
                 const resultado_openai = await fnc_OpenAi.fnc_uploadPDF_openAI(resultado_binario.path);
                 if (resultado_openai) {       
                    doc.file_openai = resultado_openai.id;
                    doc.file_path = resultado_binario.path;
                    console.log('Documento subido a OpenAI con ID:', doc.file_openai);
                    await fnc_sql_procedure.sql_insert_solicitud_files(doc);
                 }
                }
            }

            setImmediate(async () => {
                 for (const doc of lista_docs) {
                    try {
                        console.log(`🔍 Analizando documento: ${doc.file_nombre}`);
                        const OpenAi = await fnc_OpenAi.fnc_analizarPDF_openAI(doc);
                        
                        if (OpenAi.success) {
                            doc.file_json = OpenAi.data;
                            const doc_body = {
                                file_openai: doc.file_openai,
                                file_json: JSON.stringify(doc.file_json)
                            };
                            await fnc_sql_procedure.sql_update_solicitud(doc_body);


                            console.log(`✅ Análisis completado para: ${doc.file_nombre}`);
                        } else {
                            console.warn(`⚠️ No se obtuvo resultado para: ${doc.file_nombre}`);
                            doc.file_json = null;
                        }
                    } catch (error) {
                        console.error(`❌ Error analizando ${doc.file_nombre}:`, error.message);
                        doc.file_json = null;
                    }
                 }
                 console.log('✅ Todos los análisis completados');
                 
                 const documentos = [];
                    for (const doc of lista_docs) {
                        documentos.push({
                            "tipo": doc.file_tipo_doc,
                            "json": JSON.stringify(doc.file_json)
                        });
                    }

                    const bodyjson = {
                        "documentos": documentos
                    };

                  /*   const outputDirOut = path.join(__dirname, '../docs/gestion_docs/',solicitud.solicitud_id.toString());
                    // Crear directorio si no existe
                    await fs.mkdir(outputDirOut, { recursive: true });
                    const filenameout = `input_prompt_${result_solicitud.solicitud_id}_${Date.now()}.json`;
                    const filepathout = path.join(outputDirOut, filenameout);
                    await fs.writeFile(filepathout, JSON.stringify(bodyjson, null, 2), 'utf-8');

                */

                const OpenAiJson = await fnc_OpenAi.fnc_analizarJson_openAI(bodyjson);
                console.log('Resultado del análisis del JSON completo:', JSON.stringify( OpenAiJson,null,2));

                    const outputDir = path.join(__dirname, '../docs/gestion_docs/',solicitud.solicitud_id.toString());
                    
                    // Crear directorio si no existe
                    await fs.mkdir(outputDir, { recursive: true });
                    
                    const filename = `analisis_${result_solicitud.solicitud_id}_${Date.now()}.json`;
                    const filepath = path.join(outputDir, filename);
                    
                    await fs.writeFile(filepath, JSON.stringify(OpenAiJson.data, null, 2), 'utf-8');
                    


                const pathdocx = await fnc_docx.createWordDocument(OpenAiJson.data,solicitud.solicitud_id);
                //const result_estudio_titulo = await fnc_estudio_titulo.generarEstudioTitulo(OpenAiJson.data);
                //console.log('Resultado de la generación del Estudio de Título:', result_estudio_titulo);

                const MMensajeEmail = {
                    eto: solicitud.email,
                    esubject: "Envío de Documentos - Informe de Título",
                    etext: "Adjunto encontrará los documentos solicitados.",
                    //ehtml: data.plantilla,
                    attachments_file_name: [
                        {
                            filename: 'Informe_de_Titulo.docx',
                            path: pathdocx
                        }
                    ]
                };
               
               console.log('Preparando para enviar correo a:', MMensajeEmail.eto);
               console.log('file path del adjunto:', MMensajeEmail.attachments_file_name[0].path);
               await fnc_email.enviarCorreoConAdjunto(MMensajeEmail);

            });
            
            return { success: true, data: { solicitud: result_solicitud, archivos: lista_docs } };

    } catch (error) {
        fnc_logger.logger('error', `Error en upload_files (updload_files): ${error.message}`);
        return { success: false, error: error.message };
    }
}

module.exports={
    updload_files
};