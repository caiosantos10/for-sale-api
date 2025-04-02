import swaggerUi from 'swagger-ui-express';
import usersSwagger from './swagger/users.swagger';
import productsSwagger from './swagger/products.swagger';
import authSwagger from './swagger/auth.swagger';
import { env } from 'process';

// Combina as especificações
const combinedSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'For Sale API',
    version: '1.0.0',
    description: 'Documentação da API',
  },
  servers: [
    {
      url: env.PORT,
      description: 'Servidor local',
    },
  ],
  paths: {
    ...authSwagger.paths,
    ...usersSwagger.paths,
    ...productsSwagger.paths,
  },
  components: {
    schemas: {
      ...usersSwagger.components?.schemas,
      ...productsSwagger.components?.schemas,
      // ...authSwagger.components?.schemas,
    },
  },
};

// Configura o Swagger UI
export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(combinedSwagger));
};