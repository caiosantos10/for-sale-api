/**
 * Valida se o documento OpenAPI combinado é válido.
 * Capturamos o objeto passado ao swaggerUi.setup('/docs', ...).
 */
import SwaggerParser from '@apidevtools/swagger-parser';

let capturedDoc: any;
jest.mock('swagger-ui-express', () => {
  return {
    serve: (_req: any, _res: any, next: any) => next && next(),
    setup: (doc: any) => {
      capturedDoc = doc;
      return (_req: any, _res: any, next: any) => next && next();
    },
  };
});

// Importa o app DEPOIS do mock para que setupSwagger rode e nos entregue o doc
import app from '../shared/http/app';

describe('OpenAPI/Swagger - validade', () => {
  it('documento combinado é válido segundo a especificação', async () => {
    expect(capturedDoc).toBeTruthy();
    await expect(SwaggerParser.validate(capturedDoc as any)).resolves.toBeDefined();
  });
});
