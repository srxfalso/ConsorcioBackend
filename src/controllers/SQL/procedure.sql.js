const config = require('../../config/dbconfig');
const fnc_util= require('../../utils/comunes.utils');
const fnc_logger = require('../../utils/logger.utils');
const sql = require('mssql');

// retorna los saldos de los clientes del sistema
async function sql_insert_solicitud(mdl_solicitud) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('solicitud_email', sql.NVarChar, mdl_solicitud.email) // Ejemplo de parámetro de entrada
            .input('solicitud_estado', sql.Int, mdl_solicitud.estado) // Ejemplo de parámetro de entrada
            .execute('[dbo].[sp_post_solicitud]');        
        return result.recordset[0];
    } catch (error) {
        
        fnc_logger.logger('error', 'Error durante la operación en la base de datos (sql_insert_solicitud): ' + error.message);
        return null;
    }
}

// retorna los saldos de los clientes del sistema
async function sql_update_solicitud(mdl_file) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('file_openai', sql.NVarChar, mdl_file.file_openai) // Ejemplo de parámetro de entrada
            .input('file_json', sql.NVarChar, mdl_file.file_json) // Ejemplo de parámetro de entrada
            .execute('[dbo].[sp_post_update_json]');        
        return result.recordset[0];
    } catch (error) {

        fnc_logger.logger('error', 'Error durante la operación en la base de datos (sql_update_solicitud): ' + error.message);
        return null;
    }
}

async function sql_insert_solicitud_files(file) {
    try {
        const pool = await sql.connect(config);
            
            const result= await pool.request()
            .input('solicitud_id', sql.Int,file.solicitud_id) // Ejemplo de parámetro de entrada
            .input("tipo_id", sql.Int, file.tipo_id)
            .input("file_openai", sql.NVarChar, file.file_openai)
            .input("file_nombre", sql.NVarChar, file.file_nombre)
            .input("file_json", sql.NVarChar, file.file_json)
            .input("file_path", sql.NVarChar, file.file_path)
            .input("file_estado", sql.Int, file.file_estado) 
            .execute('[dbo].[sp_post_solicitud_file]');
        return result;
    } catch (error) {
        fnc_logger.logger('error', 'Error durante la operación en la base de datos (sql_insert_solicitud_files): ' + error.message);
        return null;
    }
}

module.exports = {
    sql_insert_solicitud,
    sql_insert_solicitud_files,
    sql_update_solicitud
}