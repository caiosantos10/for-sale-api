const authSwagger = {
  "tags": [
    {
      "name": "Auth",
      "description": "Opera\u00e7\u00f5es relacionadas a Auth"
    }
  ],
  "paths": {
    "/sessions": {
      "post": {
        "tags": [
          "Auth"
        ],
        "summary": "Login",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "email": "admin_teste2@mail.com.br",
                "password": "123456"
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
    }
  },
  "components": {
    "schemas": {
      "Login": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      }
    }
  }
};

export default authSwagger;
