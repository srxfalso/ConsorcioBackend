/**
 * @swagger
 * /files/solicitud:
 *   post:
 *     tags:
 *       - Files
 *     summary: Cargar archivos de solicitud
 *     description: Recibe datos y gestiona la carga de archivos relacionados a una solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               id_solicitud: 123
 *               archivos:
 *                 - nombre: "documento1.pdf"
 *                   base64: "JVBERi0xLjcKJYGBg..."
 *                 - nombre: "documento2.jpg"
 *                   base64: "/9j/4AAQSkZJRgABAQ..."
 *     responses:
 *       201:
 *         description: Archivos creados o actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 msg: "Datos Creados/actualizado"
 *                 response:
 *                   - nombre: "documento1.pdf"
 *                     estado: "OK"
 *       500:
 *         description: Error interno.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: false
 *                 msg: "Error Interno Motor de datos"
 *                 response: []
 *                 error: "Detalle del error"
 */
