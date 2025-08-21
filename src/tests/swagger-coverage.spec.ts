/**
 * Verifica cobertura mínima: para cada prefixo de rota montado em routes/index.ts
 * deve existir ao menos um path no OpenAPI que comece com esse prefixo.
 * (É um "smoke test" útil pro CI sem precisar introspecção profunda do Express.)
 */
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

import app from '../shared/http/app';

// Prefixos montados em src/shared/http/routes/index.ts
const ROUTE_PREFIXES = ['/products', '/users', '/sessions', '/password', '/profile', '/cart', '/purchase'];

// Alguns paths podem estar omitidos por desenho (docs, health)
const IGNORE_SWAGGER_PATHS = [/^\/?docs\b/i];

function hasPathStartingWith(doc: any, prefix: string) {
  const paths = doc?.paths ? Object.keys(doc.paths) : [];
  const filtered = paths.filter(p => !IGNORE_SWAGGER_PATHS.some(rx => rx.test(p)));
  return filtered.some(p => p.startsWith(prefix));
}

describe('OpenAPI/Swagger - cobertura mínima de paths', () => {
  it('há pelo menos um path documentado por prefixo montado', () => {
    expect(capturedDoc).toBeTruthy();
    const missing: string[] = [];
    for (const prefix of ROUTE_PREFIXES) {
      if (!hasPathStartingWith(capturedDoc, prefix)) {
        missing.push(prefix);
      }
    }
    expect(missing).toEqual([]);
  });
});
