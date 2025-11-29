const nodemailer = require("nodemailer");
const path = require("node:path");
const logger = require('./logger.utils');

// Configura el transporte SMTP (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  host: "mail.ajs.cl",
  port: 465,
  secure: true, // Usar TLS
  auth: {
    user: "solicitudesweb2@ajs.cl",
    pass: "ejMY5amm6GKR", // Usa variables de entorno en producción
  },
});

// Función para enviar

async function enviarCorreo(MMensajeEmail) {
    try {
      const info = await transporter.sendMail({
        from: '"Archivo Judicial de Santiago" <solicitudesweb2@ajs.cl>',
        to: MMensajeEmail.eto,
        subject: MMensajeEmail.esubject,
        text: MMensajeEmail.etext,
        html: MMensajeEmail.ehtml, // Opcional: versión HTML
      });
      logger.logger('info', `EnviarCorreo exitoso: ${info.messageId}`);
      return   info;
    } catch (error) {
      logger.logger('error', `Error EnviarCorreo: ${error.message}`);

      return error;
      
    }
  }

// Función para enviar el correo con adjunto
async function enviarCorreoConAdjunto(MMensajeEmail) {
   
  try {
    // Validar que attachments_file_name existe y es un arreglo
    if (!MMensajeEmail.attachments_file_name || !Array.isArray(MMensajeEmail.attachments_file_name)) {
      console.log('attachments_file_name debe ser un arreglo válido');
    }

    const info = await transporter.sendMail({
        from: '"Correo Informe Titulo" <solicitudesweb@ajs.cl>',
        to: MMensajeEmail.eto,
        subject: MMensajeEmail.esubject,
        text: MMensajeEmail.etext,
        html: MMensajeEmail.ehtml, // Opcional: versión HTML
        attachments: MMensajeEmail.attachments_file_name.map(attachment => ({
          filename: attachment.filename, // Nombre del archivo adjunto
          path: attachment.path, // Ruta al archivo
      })),
    });
    console.log('Correo con adjunto enviado:', info);
    logger.logger('info', `EnviarCorreoConAdjunto exitoso: ${info.messageId}`);
     
  } catch (error) {
    console.log('Correo no enviado:', error.message);
    logger.logger('error', `Error EnviarCorreoConAdjunto: ${error.message}`);

  }
}

module.exports = {
  enviarCorreo:enviarCorreo,
  enviarCorreoConAdjunto:enviarCorreoConAdjunto
}