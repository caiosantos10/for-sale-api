const userSwagger = {
  "tags": [
    {
      "name": "User",
      "description": "Opera\u00e7\u00f5es relacionadas a User"
    }
  ],
  "paths": {
    "/password/forgot": {
      "post": {
        "tags": [
          "User"
        ],
        "summary": "Forgot Password",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "email": "lara@mail.com"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/password/reset": {
      "post": {
        "tags": [
          "User"
        ],
        "summary": "Reset Password",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "password": "123456",
                "password_confirmation": "123456",
                "token": "5580632d-c5da-4bb4-9199-f90097edaa08"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/profile": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Show Profile",
        "parameters": [],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      },
      "put": {
        "tags": [
          "User"
        ],
        "summary": "Update Profile",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "name": "Admin",
                "email": "adminasd@email.com",
                "old_password": "1234",
                "new_password": "123456",
                "new_password_confirmation": "123456"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/users": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Get All Users",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "perPage",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      },
      "post": {
        "tags": [
          "User"
        ],
        "summary": "Create User",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "name": "Admin",
                "lastName": "Teste",
                "email": "admin@email.com",
                "password": "123456",
                "role": "ADMIN"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/users/706d8ab8-72bd-441e-98e6-08a5ca42e228": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Get User By Id",
        "parameters": [],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/users/{user_id}": {
      "put": {
        "tags": [
          "User"
        ],
        "summary": "Update User",
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "name": "Admin",
                "lastName": "Teste",
                "email": "admin@email.com",
                "password": "123456",
                "role": "ADMIN",
                "addresses": [
                  {
                    "street": "Rua teste dos testes",
                    "number": "S/N",
                    "city": "Cidade teste qualquer",
                    "state": "Estado para fins de teste",
                    "zip_code": "58580-000"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/users/753403dc-ef44-49fc-8483-3826f7868e35": {
      "delete": {
        "tags": [
          "User"
        ],
        "summary": "Delete User",
        "parameters": [],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ForgotPassword": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          }
        }
      },
      "ResetPassword": {
        "type": "object",
        "properties": {
          "password": {
            "type": "string"
          },
          "password_confirmation": {
            "type": "string"
          },
          "token": {
            "type": "string"
          }
        }
      },
      "UpdateProfile": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "old_password": {
            "type": "string"
          },
          "new_password": {
            "type": "string"
          },
          "new_password_confirmation": {
            "type": "string"
          }
        }
      },
      "CreateUser": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "role": {
            "type": "string"
          }
        }
      },
      "UpdateUser": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "role": {
            "type": "string"
          },
          "addresses": {
            "type": "array"
          }
        }
      }
    }
  }
};

export default userSwagger;
