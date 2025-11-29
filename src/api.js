const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const apiRoutes = require('./routes/binario.routes');
const apidownloadRoutes = require('./routes/download.routes');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Consorcio OpenAI de APIs',
        },
        tags: [
          {
                name: 'POC',
                description: 'Endpoints relacionados con el inicio de sesión',
            },
             {
                name: 'Files',
                description: 'Endpoints relacionados con la gestión de archivos',
            },
            // Agrega las demás etiquetas en el orden deseado
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // (opcional, especifica que es un JWT)
                },
            },
        },
        security: [{ bearerAuth: [] }],
        servers: [
            {
                url: 'https://gestionaideas.com:6001/api',
            },
            {
                url: 'http://localhost:6001/api', // Cambia esta URL según tu entorno
            },
        ],
    },
    apis: [
        path.join(__dirname, './routes/*.js'),
        path.join(__dirname, './schemas/**/*.js')
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRoutes); // Ruta principal
app.use('/api', apidownloadRoutes);

// Inicialización del servidor
const port = process.env.port || 6001;
app.listen(port, () => {
    console.log(`Login API iniciado en el puerto: ${port}`);
});