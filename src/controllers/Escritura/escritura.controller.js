const fs = require('node:fs');
const path = require('node:path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const utils = require('../../utils/comunes.utils');
const utilslogger = require('../../utils/logger.utils');

async function editarDocumentoDocx(dataJson,solicitud_id){
  // Construye la ruta correctamente usando path.join
  const inputPath = path.join(__dirname, '../../docs/plantilla/', 'Plantilla_ndjs.docx');
  const outputPath = path.join(__dirname, '../../docs/gestion_docs/', solicitud_id, 'estritura_' + solicitud_id + '.docx');

  const content = fs.readFileSync(inputPath, 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });


  console.log(`Documento generado correctamente: ${outputPath}`);

  doc.render({
    ESCRITURA: dataJson.ESCRITURA,
    PRIMERO: dataJson.PRIMERO,
    SEGUNDO: dataJson.SEGUNDO,
    TERCERO: dataJson.TERCERO,
    CUARTO: dataJson.CUARTO,
    QUINTO: dataJson.QUINTO,
    OCTAVO: dataJson.Octavo,
    NOVENO: dataJson.Noveno,
    DECIMO: dataJson.Decimo,
    DECiMO_QUINTO: dataJson.Decimo_quinto,
    DECIMO_SEXTO: dataJson.Decimo_sexto    
  });

  console.log('Datos renderizados correctamente en el documento.');

  const buf = doc.getZip().generate({ type: 'nodebuffer' });
  fs.writeFileSync(outputPath, buf);
  console.log(`Documento generado correctamente: ${outputPath}`);
  utilslogger.logger('exito', `Documento generado correctamente: ${outputPath}`);
  return true;
}

module.exports = {editarDocumentoDocx};