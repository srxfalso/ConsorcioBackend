const fnc_sql_procedure= require('./SQL/procedure.sql');
const fnc_util = require('../utils/comunes.utils')
const fnc_logger = require('../utils/logger.utils');

async function dowload_files_get(){
    try {

        const result = await fnc_sql_procedure.sql_get_solicitud_files();  

        return result;

    } catch (error) {
        fnc_logger.logger('error', `Error en dowload_files_get: ${error.message}`);
        throw error;
    }

}
module.exports = {
    dowload_files_get
};