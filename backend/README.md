# 🛍️ API de Produtos - Backend

Backend FastAPI integrado com **AWS RDS PostgreSQL** (ou PostgreSQL local).

## 📦 Stack Tecnológico
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Banco**: PostgreSQL (Local ou AWS RDS)
- **Server**: Uvicorn
- **Environment**: python-dotenv

## 🚀 Quick Start (Local)

### 1. Instalar dependências
```bash
pip install -r requirements.txt
```

### 2. Configurar `.env`
Copie `.env.example` para `.env` e ajuste:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Criar banco de dados
```bash
# Via psql
psql -U postgres -c "CREATE DATABASE api_db;"

# Ou automático ao iniciar a API
python setup_db.py
```

### 4. Rodar servidor
```bash
python -m uvicorn app.main:app --reload
```

API estará disponível em: http://localhost:8000
Docs automática: http://localhost:8000/docs

---

## 📊 Estrutura

```
app/
├── __init__.py
├── main.py              # FastAPI app setup
├── models/
│   └── product.py       # Modelo SQLAlchemy
├── schemas/
│   └── product_schemas.py  # Schemas Pydantic
├── routes/
│   └── product_routes.py   # Rotas CRUD
└── database/
    ├── database.py      # Conexão + ORM config
    └── fake_db.py       # (Deprecated) Removido
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos/` | Listar todos |
| POST | `/produtos/` | Criar novo |
| GET | `/produtos/{id}` | Obter por ID |
| PUT | `/produtos/{id}` | Atualizar |
| DELETE | `/produtos/{id}` | Deletar |

### Exemplo: Criar produto
```bash
curl -X POST http://localhost:8000/produtos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Camiseta",
    "descricao": "100% algodão",
    "preco": 59.90,
    "imagem": "https://example.com/img.jpg"
  }'
```

---

## 🌍 Deploy AWS

Para migrar para **AWS RDS + App Runner**, veja [SETUP_AWS.md](./SETUP_AWS.md)

### Resumo:
1. Criar RDS PostgreSQL (livre até 750h/mês)
2. Configurar variáveis em `.env`
3. Deploy no App Runner (serverless)

---

## 📝 Variáveis de Ambiente

```env
# PostgreSQL
DB_HOST=localhost              # ou RDS endpoint
DB_PORT=5432
DB_NAME=api_db
DB_USER=postgres
DB_PASSWORD=seu_password       # NUNCA commitar com valores reais
```

## 🔐 Segurança

- ✅ `.env` adicionado ao `.gitignore`
- ✅ Use `.env.example` para template
- ✅ Em produção, use AWS Secrets Manager

## 🧪 Testes

```bash
# Listar produtos
curl http://localhost:8000/produtos/

# Com dados de exemplo
python test_api.py
```

## 📚 Referências
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [AWS RDS](https://aws.amazon.com/rds/)
