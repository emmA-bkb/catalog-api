from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.product_schemas import ProductCreate, ProductResponse
from app.models.product import Product
from app.database.database import get_db

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("/", response_model=list[ProductResponse])
def listar_produtos(db: Session = Depends(get_db)):
    produtos = db.query(Product).all()
    return produtos


@router.post("/", response_model=ProductResponse)
def criar_produto(produto: ProductCreate, db: Session = Depends(get_db)):
    novo_produto = Product(
        nome=produto.nome,
        descricao=produto.descricao,
        preco=produto.preco,
        imagem=produto.imagem,
    )
    
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    
    return novo_produto


@router.get("/{produto_id}", response_model=ProductResponse)
def obter_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(Product).filter(Product.id == produto_id).first()
    if not produto:
        raise ValueError("Produto não encontrado")
    return produto


@router.put("/{produto_id}", response_model=ProductResponse)
def atualizar_produto(produto_id: int, produto_atualizado: ProductCreate, db: Session = Depends(get_db)):
    produto = db.query(Product).filter(Product.id == produto_id).first()
    if not produto:
        raise ValueError("Produto não encontrado")
    
    produto.nome = produto_atualizado.nome
    produto.descricao = produto_atualizado.descricao
    produto.preco = produto_atualizado.preco
    produto.imagem = produto_atualizado.imagem
    
    db.commit()
    db.refresh(produto)
    
    return produto


@router.delete("/{produto_id}")
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    """Deletar um produto"""
    produto = db.query(Product).filter(Product.id == produto_id).first()
    if not produto:
        raise ValueError("Produto não encontrado")
    
    db.delete(produto)
    db.commit()
    
    return {"mensagem": "Produto deletado com sucesso"}