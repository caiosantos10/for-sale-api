const authSwagger = {
    paths: {
        '/sessions': {
            post: {
                summary: 'Cria uma sessão',
                description: 'Cria uma sessão para autenticar o usuário.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', description: 'Email do usuário' },
                                    password: { type: 'string', description: 'Senha do usuário' }
                                },
                                example: {
                                    email: 'admin@email.com',
                                    password: '1234'
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Sessão criada com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string', description: 'Token de autenticação' }
                                    },
                                    example: {
                                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default authSwagger;
