# 🚀 Guia: Migração para AWS (RDS + App Runner)

## PARTE 1: Setup Local com PostgreSQL

### 1.1 Instalar PostgreSQL
- **Windows**: Baixe em https://www.postgresql.org/download/windows/
- **Marque**: "pgAdmin 4" e "Stack Builder"
- **Senha de admin**: use a mesma do seu `.env`

### 1.2 Criar banco local
```bash
# Conectar ao PostgreSQL
psql -U postgres

# No terminal PostgreSQL:
CREATE DATABASE api_db;
\q
```

### 1.3 Instalar dependências
```bash
cd backend
pip install -r requirements.txt
```

### 1.4 Testar localmente
```bash
python -m uvicorn app.main:app --reload
```
- A tabela `products` será criada automaticamente
- Teste em: http://localhost:8000/docs

---

## PARTE 2: Setup AWS RDS

### 2.1 Criar RDS PostgreSQL
1. **AWS Console** → Services → RDS
2. **Create Database** → PostgreSQL (Free tier)
3. **Configurações**:
   - **DB Instance Identifier**: `api-db-prod`
   - **Master username**: `admin`
   - **Master password**: **(gerar senha forte)**
   - **DB instance class**: `db.t3.micro` (Free tier)
   - **Storage**: 20 GB, GP2
   - **Multi-AZ**: Desabilitar (costs)
   - **Public accessibility**: **YES** (para app runner conectar)
   - **Initial database name**: `api_db`

4. **Aguardar criação** (5-10 minutos)

### 2.2 Copiar credenciais RDS
Após criar, clique no banco e copie:
- **Endpoint**: `seu-banco.xxxxx.rds.amazonaws.com`
- **Port**: `5432`
- **Username**: `admin`
- **Password**: (a que você definiu)

---

## PARTE 3: Deploy no App Runner

### 3.1 Preparar repositório
```bash
# No root do projeto
git add .
git commit -m "Migração para AWS RDS"
git push
```

### 3.2 Criar App Runner
1. **AWS Console** → Services → App Runner
2. **Create an App Runner service**
3. **Repository source**: GitHub
   - Conecte seu repositório GitHub
   - Escolha `main` branch
4. **Build settings**:
   - **Runtime**: Python 3.12
   - **Build command**: `pip install -r backend/requirements.txt`
   - **Start command**: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. **Service name**: `api-produtos`
6. **Port**: 8000
7. **Environment variables**: Adicione
   ```
   DB_HOST=seu-rds-endpoint.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=api_db
   DB_USER=admin
   DB_PASSWORD=sua-senha-forte
   ```

### 3.3 Security Group RDS
Para App Runner conectar ao RDS:
1. **RDS Console** → Databases → `api-db-prod`
2. **VPC security group**: clique no grupo
3. **Inbound Rules** → **Edit**:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: `0.0.0.0/0` (ou específicamente o App Runner)

### 3.4 Aguardar deployment
- App Runner criará a URL automaticamente
- Exemplo: `https://xxxxx.awsapprunner.com`

---

## PARTE 4: Testar API em Produção

```bash
# Testar docs
curl https://seu-app-runner-url.awsapprunner.com/docs

# Listar produtos
curl https://seu-app-runner-url.awsapprunner.com/produtos/

# Criar produto
curl -X POST https://seu-app-runner-url.awsapprunner.com/produtos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Camiseta",
    "descricao": "100% algodão",
    "preco": 59.90,
    "imagem": "https://example.com/image.jpg"
  }'
```

---

## PARTE 5: Frontend - Atualizar URL da API

No `.env` do frontend:
```env
VITE_API_URL=https://seu-app-runner-url.awsapprunner.com
```

Ou se ainda estiver em localhost para testes:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### "Connection refused" ao conectar RDS
- Verifique se Security Group do RDS permite entrada na porta 5432
- Teste: `psql -h seu-rds-endpoint.rds.amazonaws.com -U admin -d api_db`

### "psycopg2 error" no App Runner
- Certifique-se que `psycopg2-binary` está em `requirements.txt`

### Tabelas não criadas
- App Runner pode precisar de permissões. Execute manualmente:
```bash
aws rds-db-auth mysql --hostname seu-rds-endpoint.rds.amazonaws.com --port 5432 --region us-east-1 --username admin
```

### "CORS error" no frontend
- Adicione a URL do frontend no `main.py`:
```python
allow_origins=[
    "http://localhost:5173",
    "https://seu-frontend-url.vercel.app"  # Se usar Vercel
]
```

---

## 📚 Referências
- [AWS RDS Free Tier](https://aws.amazon.com/rds/free/)
- [AWS App Runner Docs](https://docs.aws.amazon.com/apprunner/)
- [SQLAlchemy + PostgreSQL](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html)

