from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.product_routes import router as product_router
from app.database.database import init_db

app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)

@app.get("/")
def home():
    return {"message": "Bem-vindo à API de Produtos!"}