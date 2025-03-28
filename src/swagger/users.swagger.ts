const userSwagger = {
  paths: {
    '/password/forgot': {
      post: {
        summary: 'Envia email para recuperação de senha',
        description: 'Envia email para o usuário com instruções para recuperar a senha.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', description: 'Email do usuário' }
                },
                example: { email: 'admin@email.com' }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email enviado com sucesso'
          }
        }
      }
    },
    '/password/reset': {
      post: {
        summary: 'Redefinir senha',
        description: 'Redefine a senha do usuário usando um token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  password: { type: 'string' },
                  password_confirmation: { type: 'string' },
                  token: { type: 'string' }
                },
                example: {
                  password: '1234',
                  password_confirmation: '1234',
                  token: 'b61acc7d-01b5-4e05-af56-6d8c718713b4'
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Senha redefinida com sucesso'
          }
        }
      }
    },
    '/profile': {
      get: {
        summary: 'Obter perfil do usuário',
        description: 'Retorna os dados do perfil do usuário autenticado.',
        responses: {
          '200': {
            description: 'Dados do perfil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Atualizar perfil do usuário',
        description: 'Atualiza os dados do perfil do usuário autenticado.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserProfile' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Perfil atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' }
              }
            }
          }
        }
      }
    },
    '/users': {
      get: {
        summary: 'Listar usuários',
        description: 'Retorna uma lista de todos os usuários.',
        responses: {
          '200': {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Criar usuário',
        description: 'Cria um novo usuário com os dados fornecidos.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Obter usuário por ID',
        description: 'Retorna os detalhes de um usuário específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do usuário',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Detalhes do usuário',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Atualizar usuário',
        description: 'Atualiza os dados de um usuário específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do usuário',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Usuário atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Excluir usuário',
        description: 'Exclui um usuário específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID do usuário',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '204': {
            description: 'Usuário excluído com sucesso'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' }
        },
        example: {
          id: '1',
          name: 'Admin',
          email: 'admin@email.com'
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          role: { type: 'string' }
        },
        example: {
          id: '1',
          name: 'Admin',
          lastName: 'Teste',
          email: 'admin@email.com',
          password: '123456',
          role: 'ADMIN'
        }
      }
    }
  }
};

export default userSwagger;
