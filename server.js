const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./src/routes');
require('dotenv').config();


const app = express();
app.use(express.json());



// --- CONFIGURAÇÃO SWAGGER ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: 'API de Gestão de Tarefas para o projeto da UMAIA'
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/controllers/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ================= ROTAS =================
app.use('/', routes);


// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API online em http://localhost:${PORT}/api-docs`);
});