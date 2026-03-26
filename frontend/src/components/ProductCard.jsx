function ProductCard({ nome, descricao, preco, imagem }) {
  return (
    <div className="card">
      <img className="card-image" src={imagem} alt={nome} />

      <div className="card-content">
        <h2 className="card-title">{nome}</h2>
        <p className="card-description">{descricao}</p>
        <div className="card-price">R$ {preco}</div>
        <button className="card-button">Comprar</button>
      </div>
    </div>
  );
}

export default ProductCard;