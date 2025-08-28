const merchantSwagger = {
  "tags": [
    {
      "name": "Merchant",
      "description": "Operations related to Merchant"
    }
  ],
  "paths": {
    "/merchants": {
      "get": {
        "tags": [
          "Merchant"
        ],
        "summary": "Get All Merchants",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      },
      "post": {
        "tags": [
          "Merchant"
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
                "legal_name": "Alfa Foods LTDA",
                "trade_name": "Alfa Lanches",
                "cnpj": "12345678000190",
                "contact_email": "contato@alfalanches.com.br",
                "phone": "85998765432"
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
    "/merchants/{merchant_id}": {
      "get": {
        "tags": [
          "Merchant"
        ],
        "summary": "Get By Id",
        "parameters": [
          {
            "name": "merchant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso"
          }
        }
      },
      "put": {
        "tags": [
          "Merchant"
        ],
        "summary": "Update",
        "parameters": [
          {
            "name": "merchant_id",
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
                "legal_name": "Alfa Foods LTDA",
                "trade_name": "Alfa Lanches",
                "cnpj": "12345678000190",
                "contact_email": "contato@alfalanches.com.br",
                "phone": "85998765432"
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
          "Merchant"
        ],
        "summary": "Delete",
        "parameters": [
          {
            "name": "merchant_id",
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
  },
  "components": {
    "schemas": {
      "Create": {
        "type": "object",
        "properties": {
          "legal_name": {
            "type": "string"
          },
          "trade_name": {
            "type": "string"
          },
          "cnpj": {
            "type": "number"
          },
          "contact_email": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          }
        }
      },
      "Update": {
        "type": "object",
        "properties": {
          "legal_name": {
            "type": "string"
          },
          "trade_name": {
            "type": "string"
          },
          "cnpj": {
            "type": "number"
          },
          "contact_email": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          }
        }
      }
    }
  }
};

export default merchantSwagger;
