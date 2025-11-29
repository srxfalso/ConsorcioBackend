
const fnc_utils = require('../../utils/comunes.utils');
const fnc_logger = require('../../utils/logger.utils');
const fs  = require('node:fs');
const path = require('node:path'); 
const axios = require('axios');
const FormData = require('form-data');

// Variables de entorno
const apiKey = process.env.JWT_SECRET_OPENAI;
const prompt_analiza_pdf = process.env.PROMPT_ANALIZA_PDF;
const timeout = process.env.PROMPT_TIEMPO_EXPIRACION_OPENAI;
const prompt_version = process.env.PROMPT_VERSION_OPENAI;


// Carga Files a openAI

async function fnc_uploadPDF_openAI(pdfPath) {
    try {
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            throw new Error(`Archivo no encontrado: ${pdfPath}`);
        }

        console.log(`📤 Subiendo PDF a OpenAI: ${pdfPath}`);
        console.log(`Usando API Key: ${apiKey ? '[PROVIDED]' : '[NOT PROVIDED]'}`);

        const formData = new FormData();
        formData.append("purpose", "assistants");
        formData.append("file", fs.createReadStream(pdfPath));
        formData.append("expires_after[anchor]", "created_at");
        formData.append("expires_after[seconds]", "432000"); // 5 días

        const response = await axios.post("https://api.openai.com/v1/files", formData, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
            timeout: 120000, // ✅ Aumentar timeout a 2 minutos
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log("✅ PDF subido exitosamente:", response.data.id);
        return response.data;
        
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error("❌ Error subiendo PDF:", errorMsg);
        fnc_logger.logger('error', `Error en fnc_uploadPDF_openAI: ${errorMsg}`);
        return null;
    }
}

// Mapa de configuración de prompts por tipo de documento
const PROMPT_CONFIG = {
    100: { prompt: 'DNI_PROMPT', version: 'DNI_VERSION', name: 'DNI' },
    110: { prompt: 'DNI_PROMPT', version: 'DNI_VERSION', name: 'DNI' },
    120: { prompt: 'MATRIMO_PROMPT', version: 'MATRIMO_VERSION', name: 'MATRIMONIO' },
    130: { prompt: 'PENSION_ALIM_PROMPT', version: 'PENSION_ALIM_VERSION', name: 'PENSION ALIMENTICIA' },
    140: { prompt: 'PENSION_ALIM_PROMPT', version: 'PENSION_ALIM_VERSION', name: 'PENSION ALIMENTICIA' },
    150: { prompt: 'PAGO_CONTRI_PROMPT', version: 'PAGO_CONTRI_VERSION', name: 'PAGO CONTRIBUCIONES' },
    160: { prompt: 'AFECTACION_PUBLICA_PROMPT', version: 'AFECTACION_PUBLICA_VERSION', name: 'AFECTACION PUBLICA' },
    170: { prompt: 'HIPOTECAS_PROMPT', version: 'HIPOTECAS_VERSION', name: 'HIPOTECAS' },
    180: { prompt: 'DOMINIO_VIG_PROMPT', version: 'DOMINIO_VIG_VERSION', name: 'DOMINIO VIGENTE' },
    190: { prompt: 'SERVIU_PROMPT', version: 'SERVIU_VERSION', name: 'SERVIU' }
};

// Función auxiliar para obtener configuración de prompt
function getPromptConfig(tipoId) {
    const config = PROMPT_CONFIG[tipoId];
    if (!config) {
        console.log('Tipo de solicitud no reconocido, usando prompt por defecto');
        return { prompt_id: '', prompt_ver: '' };
    }
    
    console.log(`Analizando como ${config.name}`);
    return {
        prompt_id: process.env[config.prompt],
        prompt_ver: process.env[config.version]
    };
}

// Función auxiliar para extraer JSON del texto
function extractJSON(text) {
    try {
        return JSON.parse(text);
    } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError);
        console.log("Texto que falló al parsear:", text);
        
        // Intentar extraer JSON usando regex como fallback
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw parseError;
    }
}

// Analiza PDF en OpenAI y retorna el JSON extraído
async function fnc_analizarPDF_openAI(file) {
    console.log('Tipo de solicitud recibido para análisis:', file.tipo_id);

    const { prompt_id, prompt_ver } = getPromptConfig(file.tipo_id);
    console.log(`Usando prompt_id: ${prompt_id}, prompt_ver: ${prompt_ver}`);

    try {
        console.log(`🔍 Iniciando análisis del PDF con file_id: ${file.file_openai}`);

        const requestData = {
            model: "gpt-5",
            prompt: {
                id: prompt_id,
                version: prompt_ver
            },
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: "Analiza el PDF"
                        },
                        {
                            type: "input_file",
                            file_id: file.file_openai
                        }
                    ]
                }
            ]
        };

        const response = await axios.post("https://api.openai.com/v1/responses", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            timeout: Number.parseInt(timeout) || 300000 // 5 minutos
        });

        console.log("✅ Análisis completado:", response.data.status);
        console.log("Response ID:", response.data.id);

        // Buscar el mensaje del assistant
        const assistantMessage = response.data.output?.find(
            item => item.type === "message" && 
                   item.role === "assistant" && 
                   Array.isArray(item.content)
        );

        // Buscar el contenido de texto
        const textContent = assistantMessage?.content?.find(
            content => content.type === "output_text" && content.text
        );

        if (textContent?.text) {
            console.log('📄 Contenido extraído de OpenAI:', textContent.text.substring(0, 1000) + '...');

            try {
                const extractedData = extractJSON(textContent.text);
                console.log("✅ JSON parseado exitosamente");
                
                return {
                    success: true,
                    data: extractedData,
                    response_id: response.data.id,
                    usage: response.data.usage
                };
            } catch (parseError) {
                return {
                    success: false,
                    error: "Error parseando el JSON de respuesta",
                    raw_text: textContent.text,
                    parse_error: parseError.message
                };
            }
        }

        // Respuesta inesperada
        console.error("❌ Estructura de respuesta inesperada");
        return {
            success: false,
            error: "No se encontró contenido JSON en la respuesta",
            response_structure: {
                has_output: !!response.data.output,
                output_length: response.data.output?.length || 0,
                output_types: response.data.output?.map(item => item.type) || []
            }
        };
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error("❌ Error analizando PDF:", errorMsg);
        
        // ✅ Loguear detalles del error para debugging
        if (error.response?.data) {
            console.error("Detalles del error de API:", error.response.data);
        }
        
        fnc_logger.logger('error', `Error en fnc_analizarPDF_openAI para file_id ${file_id}: ${errorMsg}`);
        
        return {
            success: false,
            error: errorMsg,
            error_details: error.response?.data
        };
    }
}

// Analiar JSON  y entrega una estructura estandarizada
async function fnc_analizarJson_openAI(JsonData) {
   
    try {
        console.log(`🔍 Iniciando análisis del JSON: ${JSON.stringify(JsonData)}`);

        const requestData = {
            model: "gpt-5",
            prompt: {
                id: "pmpt_692328fe1e8481938be75f3e4245ef45011edfd37dd99344",
                version: "5"
            },
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: "Analiza el JSON:" + JSON.stringify(JsonData)
                        } 
                    ]
                }
            ]
        };

        const response = await axios.post("https://api.openai.com/v1/responses", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            timeout: Number.parseInt(timeout) || 300000 // 5 minutos
        });

        console.log("✅ Análisis completado:", response.data.status);
       

        // Buscar el mensaje del assistant
        const assistantMessage = response.data.output?.find(
            item => item.type === "message" && 
                   item.role === "assistant" && 
                   Array.isArray(item.content)
        );

        // Buscar el contenido de texto
        const textContent = assistantMessage?.content?.find(
            content => content.type === "output_text" && content.text
        );

        if (textContent?.text) {
            console.log('📄 Contenido extraído de OpenAI:', textContent.text.substring(0, 1000) + '...');

            try {
                const extractedData = extractJSON(textContent.text);
                console.log("✅ JSON parseado exitosamente");
                
                return {
                    success: true,
                    data: extractedData,
                    response_id: response.data.id,
                    usage: response.data.usage
                };
            } catch (parseError) {
                return {
                    success: false,
                    error: "Error parseando el JSON de respuesta",
                    raw_text: textContent.text,
                    parse_error: parseError.message
                };
            }
        }

        // Respuesta inesperada
        console.error("❌ Estructura de respuesta inesperada");
        return {
            success: false,
            error: "No se encontró contenido JSON en la respuesta",
            response_structure: {
                has_output: !!response.data.output,
                output_length: response.data.output?.length || 0,
                output_types: response.data.output?.map(item => item.type) || []
            }
        };
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error("❌ Error analizando PDF:", errorMsg);
        
        // ✅ Loguear detalles del error para debugging
        if (error.response?.data) {
            console.error("Detalles del error de API:", error.response.data);
        }
        
        fnc_logger.logger('error', `Error en fnc_analizarPDF_openAI para file_id ${file_id}: ${errorMsg}`);
        
        return {
            success: false,
            error: errorMsg,
            error_details: error.response?.data
        };
    }
}


module.exports = {
    fnc_uploadPDF_openAI,
    fnc_analizarPDF_openAI,
    fnc_analizarJson_openAI
};