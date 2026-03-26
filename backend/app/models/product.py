from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), index=True)
    descricao = Column(String(500))
    preco = Column(Float)
    imagem = Column(String(500))
