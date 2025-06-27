const purchaseSwagger = {
  "tags": [
    {
      "name": "Purchase",
      "description": "Opera\u00e7\u00f5es relacionadas a Purchase"
    }
  ],
  "paths": {
    "/purchase/{purchase_id}": {
      "get": {
        "tags": [
          "Purchase"
        ],
        "summary": "Get Purchase By Id",
        "parameters": [
          {
            "name": "purchase_id",
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
          "Purchase"
        ],
        "summary": "Update Purchase Status",
        "parameters": [
          {
            "name": "purchase_id",
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
                "status": "GETTING_READY"
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
    "/purchase": {
      "get": {
        "tags": [
          "Purchase"
        ],
        "summary": "List Purchases",
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
          "Purchase"
        ],
        "summary": "Create Purchase",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "delivery_address": {
                  "street": "Rua Jos\u00e9 Nunes",
                  "number": "34",
                  "city": "S\u00e3o Paulo",
                  "state": "SP",
                  "zip_code": "58580-000"
                },
                "payment_method": {
                  "method": "card",
                  "installments": "2",
                  "cardBrand": "teste"
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
    },
    "/purchase/{purchase_id}/cancelar": {
      "put": {
        "tags": [
          "Purchase"
        ],
        "summary": "Cancel Purchase",
        "parameters": [
          {
            "name": "purchase_id",
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
                "status": "GETTING_READY"
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
      "UpdatePurchaseStatus": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          }
        }
      },
      "CreatePurchase": {
        "type": "object",
        "properties": {
          "delivery_address": {
            "type": "object"
          },
          "payment_method": {
            "type": "object"
          }
        }
      },
      "CancelPurchase": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          }
        }
      }
    }
  }
};

export default purchaseSwagger;
