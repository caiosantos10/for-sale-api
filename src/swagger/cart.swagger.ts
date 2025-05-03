const cartSwagger = {
  paths: {
    "/cart/{cart_id}": {
      "get": {
        "summary": "Get Cart By Id",
        "description": "Get Cart By Id",
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Cart"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "cart_id",
            "in": "path",
            "required": true,
            "description": "ID do carrinho",
            "schema": {
              "type": "string"
            }
          }
        ]
      },
      "put": {
        "summary": "Update Cart",
        "description": "Update Cart",
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Cart"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "cart_id",
            "in": "path",
            "required": true,
            "description": "ID do carrinho",
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
                "$ref": "#/components/schemas/Cart"
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete Cart",
        "description": "Delete Cart",
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Cart"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "cart_id",
            "in": "path",
            "required": true,
            "description": "ID do carrinho",
            "schema": {
              "type": "string"
            }
          }
        ]
      }
    },
    "/cart/by-user/{user_id}": {
      "get": {
        "summary": "Get Cart By User Id",
        "description": "Get Cart By User Id",
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Cart"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": true,
            "description": "ID do usuário",
            "schema": {
              "type": "string"
            }
          }
        ]
      }
    },
    "/cart": {
      "post": {
        "summary": "Create Cart",
        "description": "Create Cart",
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Cart"
                }
              }
            }
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Cart"
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Cart": {
        "type": "object",
        "properties": {
          "products": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "ID do produto"
                },
                "quantity": {
                  "type": "string",
                  "description": "Quantidade do produto"
                },
                "observations": {
                  "type": "string",
                  "description": "Observações sobre o produto"
                },
                "desenho": {
                  "type": "string",
                  "description": "Campo desenho (opcional)"
                }
              }
            }
          }
        },
        "example": {
          "products": [
            {
              "id": "4c4e592f-fb41-4d1e-8daa-b922636c7901",
              "quantity": "3",
              "observations": "Bla bla bla"
            }
          ]
        }
      }
    }
  }
};

export default cartSwagger;