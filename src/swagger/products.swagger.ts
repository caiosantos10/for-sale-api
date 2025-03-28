const productSwagger = {
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
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Cria um novo produto',
        description: 'Cria um novo produto com os dados fornecidos.',
        requestBody: {
          description: 'Dados do novo produto',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Produto criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          }
        }
      }
    },
    '/products/{id}': {
      get: {
        summary: 'Retorna um produto por ID',
        description: 'Retorna os detalhes de um produto específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do produto',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Detalhes do produto',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Atualiza um produto',
        description: 'Atualiza os dados de um produto específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do produto',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          description: 'Dados para atualizar o produto',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Produto atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove um produto',
        description: 'Exclui um produto específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do produto',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '204': {
            description: 'Produto removido com sucesso'
          }
        }
      }
    },
    '/products/image/{id}': {
      patch: {
        summary: 'Atualiza a imagem do produto',
        description: 'Atualiza a imagem de um produto específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do produto',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          description: 'Imagem do produto em formato de arquivo',
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Imagem atualizada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID do produto' },
          name: { type: 'string', description: 'Nome do produto' },
          description: { type: 'string', description: 'Descrição do produto' },
          price: { type: 'number', description: 'Preço do produto' }
        },
        example: {
          id: '1',
          name: 'Smartphone',
          description: 'Um smartphone moderno',
          price: 699.99
        }
      }
    }
  }
};

export default productSwagger;
