import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CriarProduto() {
  const navigate = useNavigate();

  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/produtos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Produto criado", data);

      navigate("/");
    } catch (error) {
      console.error("Falha ao criar produto", error);
      alert("Falha ao criar produto. Verifique o console para detalhes.");
    }
  }

  return (
    <div className="form-page">
      <form className="product-form" onSubmit={handleSubmit}>
        <h1>Criar Produto</h1>

        <input
          type="text"
          name="nome"
          placeholder="Nome do produto"
          value={produto.nome}
          onChange={handleChange}
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={produto.descricao}
          onChange={handleChange}
        />

        <input
          type="text"
          name="preco"
          placeholder="Preço"
          value={produto.preco}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imagem"
          placeholder="URL da imagem"
          value={produto.imagem}
          onChange={handleChange}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default CriarProduto;