from pydantic import BaseModel


class ProductCreate(BaseModel):
    nome: str
    descricao: str
    preco: float
    imagem: str


class ProductResponse(ProductCreate):
    id: int