# for-sale-api

**For Sale**, será uma plataforma de e-commerce local que conecta compradores e vendedores em Serra Branca. Este projeto tem como objetivo facilitar o comércio local, promovendo a interação entre usuários e fomentando a economia da cidade.

Este repositório se refere ao backend desta aplicação.

---

## 🚀 Funcionalidades Principais
- **Cadastro de usuários:** Criar contas para compradores e vendedores.
- **Gerenciamento de produtos:** Cadastro, edição e exclusão de produtos.
- **Carrinho de compras:** Adicionar produtos ao carrinho e finalizar pedidos.
- **Mensagens internas:** Comunicação direta entre compradores e vendedores.
- **Pagamentos integrados:** Suporte a Pix e gateways de pagamento (ex.: Mercado Pago e PagSeguro).
- **Avaliações:** Avalie vendedores e produtos após a compra.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework:** Node.js (NestJS)
- **Autenticação:** JSON Web Tokens (JWT)
- **ORM:** TypeORM

### Banco de Dados
- **Banco relacional:** PostgreSQL

### Infraestrutura
- **Contêinerização:** Docker
- **Armazenamento de Arquivos:** 
- **Hospedagem:** 

---

## 📂 Estrutura do Projeto

### Backend
```
backend/
├── src/
│   ├── modules/
│   │   ├── users/         # Gerenciamento de usuários
│   │   ├── products/      # CRUD de produtos
│   │   ├── sales/         # Gerenciamento de vendas
│   │   └── messages/      # Mensagens entre usuários
│   ├── config/            # Configurações (ex.: banco de dados, autenticação)
│   ├── entities/          # Definições de tabelas e relacionamentos
│   └── server.ts          # Arquivo principal do servidor
```

### Docker
- Arquivo `docker-compose.yml` para gerenciar os serviços (frontend, backend, banco de dados).

---

## ⚙️ Configuração e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Angular CLI](https://angular.io/cli)
- Conta na [Azure](https://azure.microsoft.com/) (opcional para deploy).

### Passos para Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/for-sale-api.git
   cd for-sale-api
   ```

2. **Configuração do Backend:**
   - Renomeie o arquivo `.env.example` para `.env`.
   - Configure as variáveis de ambiente (ex.: conexões de banco, secret JWT).

4. **Inicie com Docker:**
   - Execute o comando:
     ```bash
     docker-compose up --build
     ```

5. **Acesse a aplicação:**
   - Backend: `http://localhost:3000`

---

## 📄 Licença
Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 📞 Contato
Se tiver dúvidas ou sugestões, entre em contato:
- **Email:** caiosant10@gmail.com
- **WhatsApp:** (83) 99999-9999

