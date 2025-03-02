const productsSwagger = {
  paths: {
    '/products': {
      get: {
        summary: 'Retorna a lista de produtos',
        description: 'Retorna uma lista de todos os produtos cadastrados.',
        responses: {
          '200': {
            description: 'Lista de produtos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID do produto',
          },
          name: {
            type: 'string',
            description: 'Nome do produto',
          },
        },
        example: {
          id: 1,
          name: 'Smartphone',
        },
      },
    },
  },
};

export default productsSwagger;