const usersSwagger = {
  paths: {
    '/users': {
      get: {
        summary: 'Retorna a lista de usuários',
        description: 'Retorna uma lista de todos os usuários cadastrados.',
        responses: {
          '200': {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
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
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID do usuário',
          },
          name: {
            type: 'string',
            description: 'Nome do usuário',
          },
        },
        example: {
          id: 1,
          name: 'John Doe',
        },
      },
    },
  },
};

export default usersSwagger;