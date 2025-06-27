const cartSwagger = {
  "tags": [
    {
      "name": "Cart",
      "description": "Opera\u00e7\u00f5es relacionadas a Cart"
    }
  ],
  "paths": {
    "/cart/{cart_id}": {
      "get": {
        "tags": [
          "Cart"
        ],
        "summary": "Get Cart By Id",
        "parameters": [
          {
            "name": "cart_id",
            "in": "path",
            "required": true,
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
      "put": {
        "tags": [
          "Cart"
        ],
        "summary": "Update Cart",
        "parameters": [
          {
            "name": "cart_id",
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
                "products": [
                  {
                    "id": "4c4e592f-fb41-4d1e-8daa-b922636c7901",
                    "quantity": "3",
                    "observations": "Bla bla bla",
                    "desenho": "teste"
                  },
                  {
                    "id": "ef00b44a-336b-41d3-a402-728cb9bd8240",
                    "quantity": "5",
                    "observations": "Com Queijo e Presunto"
                  },
                  {
                    "id": "5c9618c3-370b-43fe-8691-c95fc9c6b473",
                    "quantity": "2",
                    "observations": "Adicione Leite Ninho e Leite Condensado"
                  },
                  {
                    "id": "bdce7ad9-10cf-424d-b04f-76d03937925c"
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
      },
      "delete": {
        "tags": [
          "Cart"
        ],
        "summary": "Delete Cart",
        "parameters": [
          {
            "name": "cart_id",
            "in": "path",
            "required": true,
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
      }
    },
    "/cart/by-user/{user_id}": {
      "get": {
        "tags": [
          "Cart"
        ],
        "summary": "Get Cart By User Id",
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
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/cart": {
      "post": {
        "tags": [
          "Cart"
        ],
        "summary": "Create Cart",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "products": [
                  {
                    "id": "4c4e592f-fb41-4d1e-8daa-b922636c7901",
                    "quantity": "3",
                    "observations": "Bla bla bla"
                  },
                  {
                    "id": "a9e805f5-939e-4269-a112-6e657ba7d6af",
                    "quantity": "1",
                    "observations": "teste de observa\u00e7\u00e3o"
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
    }
  },
  "components": {
    "schemas": {
      "UpdateCart": {
        "type": "object",
        "properties": {
          "products": {
            "type": "array"
          }
        }
      },
      "CreateCart": {
        "type": "object",
        "properties": {
          "products": {
            "type": "array"
          }
        }
      }
    }
  }
};

export default cartSwagger;
