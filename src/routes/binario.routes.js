const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fnc_upload = require('../controllers/upload.controllers');

// Ruta para crear un nuevo binario
require('../schemas/files/upload.schemas');
router.route('/files/solicitud').post((request, response) => {
    let body_file = { ...request.body };
    fnc_upload.updload_files(body_file)
        .then(result => {
                if (result.length == 0) {
                    response.status(500).send({ 
                        code: '101', 
                        msg: 'Error Interno Motor de datos', 
                        response: [] 
                    });
                } else {
                    response.status(201).send({ 
                        success: true, 
                        msg: 'Datos Creados/actualizado', 
                        response: result 
                });
            }
        }).catch(error => {
                console.error('Error en binario_post:', error);
                response.status(500).send({ 
                    success: false, 
                    msg: 'Error Interno Motor de datos', 
                    response: [],
                    error: error.message 
                });
            });
    });

module.exports = router;  