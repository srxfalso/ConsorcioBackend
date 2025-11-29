/**
 * @swagger
 * /solicitud/find:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Obtiene todas las solicitudes registradas
 *     description: Retorna un arreglo con el listado de solicitudes y su estado actual.
 *     responses:
 *       202:
 *         description: Lista de solicitudes encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   solicitud_id:
 *                     type: integer
 *                     example: 56
 *                   solicitud_fecha:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-29"
 *                   TiempoTranscurrido:
 *                     type: string
 *                     example: "23 min."
 *                   solicitud_email:
 *                     type: string
 *                     format: email
 *                     example: "rjp@gestionaideas.com"
 *                   solicitud_estado_id:
 *                     type: integer
 *                     example: 1
 *                   solicitud_estado_descripcion:
 *                     type: string
 *                     example: "Procesando"
 *       204:
 *         description: No existen solicitudes
 *       500:
 *         description: Error interno del servidor
 */