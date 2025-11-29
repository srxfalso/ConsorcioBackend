const fs  = require('node:fs');
const path = require('node:path'); 
const logger = require('../../utils/logger.utils');

async function binario_gestion_doc_pdf(files) {
  try {
    const baseFolder = "src/docs/gestion_docs"; // Carpeta base para almacenar los documentos
    const folderPath = path.join(
      baseFolder,    
      files.solicitud_id.toString(), // ID de la solicitud
      files.path_gestion.toString(), // Ruta de gestión
    );
    files.nombre_documento= files.nombre_documento + '.pdf';

    // Aseguramos que la carpeta exista
    await fs.promises.mkdir(folderPath, { recursive: true });

    // Destino con el nombre del nuevo documento
    const destino = path.join(folderPath, files.nombre_documento);
   

    // Copiar archivo
    //await fs.promises.copyFile(origen, destino);
    let base64String = files.base64;
    if (base64String.includes(',')) {
      base64String = base64String.split(',')[1];
    }

    // Convertir base64 a buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Guardar el archivo desde el buffer
    await fs.promises.writeFile(destino, buffer);
    return { success: true, path: destino };
  } catch (err) {
    logger.logger('error', `Error en binario_gestion_doc_pdf para documento ${files.nombre_documento}: ${err.message}`);
    return { success: false, error: err.message };
  }
}
module.exports = {
    binario_gestion_doc_pdf
};