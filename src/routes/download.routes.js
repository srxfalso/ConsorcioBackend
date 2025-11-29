const express = require('express');
const router = express.Router();
const fnc_upload = require('../controllers/download.controller');


require('../schemas/files/download.schemas');
router.route('/solicitud/find').get((request, response) => {
    
    fnc_upload.dowload_files_get()
            .then(result => {
                if (result.length == 0) {
                    response.status(204).send(result);
                } else {
                    response.status(202).json(result);
                }
            })
            .catch(error => {
                console.error('Error en notaria_get:', error);
                response.status(500).send({
                    code_error: 1,
                    msg: 'Error interno del servidor',
                    error: error.message
                });
            });


    });

module.exports = router;  