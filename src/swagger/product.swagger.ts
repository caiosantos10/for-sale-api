const productSwagger = {
  "tags": [
    {
      "name": "Product",
      "description": "Opera\u00e7\u00f5es relacionadas a Product"
    }
  ],
  "paths": {
    "/products": {
      "get": {
        "tags": [
          "Product"
        ],
        "summary": "Get All Products",
        "parameters": [],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      },
      "post": {
        "tags": [
          "Product"
        ],
        "summary": "Create",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "name": "Primeiro produto",
                "description": "Adicionando primeiro produto no banco para testar CRUD",
                "price": "0.5"
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
    "/products/0aeae9c2-33dd-4965-b0da-35810eb54c63": {
      "get": {
        "tags": [
          "Product"
        ],
        "summary": "Get By Id",
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
          "Product"
        ],
        "summary": "Update",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "name": "Primeiro produto",
                "description": "Alterando dados do primeiro produto no banco para testar CRUD",
                "price": "345"
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
          "Product"
        ],
        "summary": "Delete",
        "parameters": [],
        "requestBody": {},
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      }
    },
    "/products/image/4c4e592f-fb41-4d1e-8daa-b922636c7901": {
      "patch": {
        "tags": [
          "Product"
        ],
        "summary": "Update Product Image",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "image": {
                    "type": "string",
                    "format": "binary"
                  }
                }
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
      "Create": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      },
      "Update": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "price": {
            "type": "string"
          }
        }
      }
    }
  }
};

export default productSwagger;
