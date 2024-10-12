import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import instance from "./axios/axiosInstance";
import ProductCard from "../components/cards/ProductCard";
import { Radio } from "antd";
import { prices } from "../prices";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [radio, setRadio] = useState([0, 10000]); // Estado inicial: "Todos"
  const [page, setPage] = useState(1); // Página actual
  const [totalProducts, setTotalProducts] = useState(0); // Total de productos
  const size = 52; // Tamaño de cada página

  // Cargar productos al cambiar de filtro o página
  useEffect(() => {
    loadFilteredProducts();
  }, [radio, page]);

  // Cargar productos filtrados por precio y paginados
  const loadFilteredProducts = async () => {
    try {
      const { data } = await instance.get(
        `/products/filter?minPrice=${radio[0]}&maxPrice=${radio[1]}&page=${page}&size=${size}`
      );
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (err) {
      console.error(err);
    }
  };

  // Manejar selección de filtro por precio
  const handleRadio = (e) => {
    setRadio(e.target.value);
    setPage(1); // Reiniciar a la primera página
  };

  // Manejar cambio de página y deslizar hacia arriba
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalProducts / size)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Deslizar hacia arriba
    }
  };

  return (
    <>
      <Jumbotron title="PrimeMarket" subTitle="Bienvenidos a nuestra Tienda en línea" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Filtrar por Precio</h2>
            <div className="row px-4 py-2">
              <Radio.Group onChange={handleRadio} value={radio} style={{ width: "100%" }}>
                {prices.map((p) => (
                  <Radio
                    key={p._id}
                    value={p.array}
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>

          <div className="col-md-9">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
              {totalProducts} Productos
            </h2>
            <div className="row">
              {products.map((p) => (
                <div className="col-md-3" key={p.id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>

            {/* Barra de Paginación */}
            <nav aria-label="Page navigation" className="mt-4">
              <ul className="pagination justify-content-center"  >
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: Math.ceil(totalProducts / size) },
                  (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${page === index + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                        
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    page === Math.ceil(totalProducts / size) ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
