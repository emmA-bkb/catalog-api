import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

        const response = await fetch(`${apiUrl}/produtos/`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }

        const data = await response.json();
        console.log("Produtos recebidos:", data);
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    carregarProdutos();
  }, [location]);

  return (
    <div className="page-container">
      <div className="top-bar">
        <h1>Produtos</h1>

        <Link to="/criar" className="nav-button">
          Criar Produto
        </Link>
      </div>

      <div className="products-grid">
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <ProductCard
              key={produto.id}
              nome={produto.nome}
              descricao={produto.descricao}
              preco={produto.preco}
              imagem={produto.imagem}
            />
          ))
        ) : (
          <p>Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default Home;