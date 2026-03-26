# Guia: Deploy com Render (PostgreSQL + Web Service)

## PARTE 1: Setup Local com PostgreSQL

### 1.1 Instalar PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Marque: pgAdmin 4

### 1.2 Criar banco local
psql -U postgres

CREATE DATABASE api_db;
\q

### 1.3 Instalar dependências
cd backend
pip install -r requirements.txt

### 1.4 Rodar localmente
python -m uvicorn app.main:app --reload

Testar:
http://localhost:8000/docs

---

## PARTE 2: Criar Banco no Render

### 2.1 Criar PostgreSQL

1. Acesse: https://render.com  
2. Clique em:
   New + → PostgreSQL

### 2.2 Configuração

- Name: api-db
- Plan: Free
- Region: mesma do backend

Clique em Create Database

### 2.3 Copiar credenciais

Após criar:

Vá em Connections

Copie:
Internal Database URL

Use apenas essa URL

---

## PARTE 3: Deploy Backend no Render

### 3.1 Subir código
git add .
git commit -m "deploy render"
git push

### 3.2 Criar Web Service

1. Render → New + → Web Service
2. Conectar GitHub
3. Selecionar seu repositório

### 3.3 Configuração do serviço

- Name: catalog-api

- Root Directory:
backend

- Environment:
Python 3

Build Command:
pip install -r requirements.txt

Start Command:
uvicorn app.main:app --host 0.0.0.0 --port 10000

Instance Type:
Free

### 3.4 Variáveis de ambiente

Adicionar no Render:

DATABASE_URL=postgresql://user:password@host:5432/dbname

Cole aqui a Internal Database URL

---

## PARTE 4: Deploy

Clique em Create Web Service

Ou depois:
Manual Deploy → Deploy latest commit

---

## PARTE 5: Testar API

Acesse:

https://seu-app.onrender.com/docs

### Testes via curl

Listar produtos:
curl https://seu-app.onrender.com/produtos/

Criar produto:
curl -X POST https://seu-app.onrender.com/produtos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Camiseta",
    "descricao": "100% algodão",
    "preco": 59.90,
    "imagem": "https://example.com/image.jpg"
  }'

---

## PARTE 6: Frontend

No .env do frontend:

VITE_API_URL=https://seu-app.onrender.com

Exemplo no React (Vite):

const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/produtos`)
  .then(res => res.json())
  .then(data => console.log(data));

---

## Troubleshooting

Application startup failed:
- Verifique se DATABASE_URL está correto
- Confirme que copiou a Internal Database URL

Erro de conexão com banco:
- Certifique-se que o banco está ativo no Render
- Use somente Internal URL

ModuleNotFoundError:
- Verifique requirements.txt

Porta incorreta:
- Render usa porta 10000

CORS error:
- Permitir localhost:5173 no backend