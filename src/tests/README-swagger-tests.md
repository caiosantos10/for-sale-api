# Tests de Swagger/OpenAPI

Foram adicionados dois testes em `tests/`:

- `swagger-valid.spec.ts`: valida o documento OpenAPI combinado passado ao Swagger UI (`/docs`).
- `swagger-coverage.spec.ts`: garante que existe pelo menos um `path` no OpenAPI para cada prefixo de rota montado em `routes/index.ts` (`/products`, `/users`, ...).

## Pré-requisitos
Instale:
```bash
npm i -D @apidevtools/swagger-parser
```

## Rodar
```bash
npm run test
# ou com cobertura
npm run test:coverage
```
