const fs = require('fs');
const path = require('path');

/**
 * Registra un mensaje de log con estructura de carpetas por fecha.
 * @param {'error'|'exito'} tipo Tipo de mensaje (error o exito).
 * @param {string} mensaje Mensaje a registrar en el log.
 */
function logger(tipo, mensaje) {
  if (tipo !== 'error' && tipo !== 'exito') {
    throw new Error("Tipo debe ser 'error' o 'exito'");
  }

  const ahora = new Date();

  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, '0');
  const day = String(ahora.getDate()).padStart(2, '0');
  const hour = String(ahora.getHours()).padStart(2, '0');
  const minute = String(ahora.getMinutes()).padStart(2, '0');
  const second = String(ahora.getSeconds()).padStart(2, '0');

  const baseDir = path.join('./src/log', `${year}`, `${month}`, `${day}`);
  
  
  const fileName = `${year}${month}${day}.log`;
  const filePath = path.join(baseDir, fileName);

  const logLine = `${year}${month}${day}${hour}${minute}${second}\t${tipo.toUpperCase()}\t${mensaje}\n`;

  // Crear carpetas si no existen
  fs.mkdirSync(baseDir, { recursive: true });
  // Agregar línea al archivo
  fs.appendFileSync(filePath, logLine, 'utf8');
}
module.exports = {
    logger
}