import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CriarProduto from "./pages/CriarProduto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar" element={<CriarProduto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;