import swaggerUi from 'swagger-ui-express';
import userSwagger from './swagger/user.swagger';
import productSwagger from './swagger/product.swagger';
import authSwagger from './swagger/auth.swagger';
import { env } from 'process';
import cartSwagger from './swagger/cart.swagger';

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
  _paths: {
    ...authSwagger.paths,
    ...userSwagger.paths,
    ...productSwagger.paths,
    ...cartSwagger.paths,
  },
  get paths() {
    return this._paths;
  },
  set paths(value) {
    this._paths = value;
  },
  components: {
    schemas: {
      ...userSwagger.components?.schemas,
      ...productSwagger.components?.schemas,
      ...cartSwagger.components?.schemas,
      ...authSwagger.components?.schemas,
    },
  },
};

// Configura o Swagger UI
export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(combinedSwagger));
};