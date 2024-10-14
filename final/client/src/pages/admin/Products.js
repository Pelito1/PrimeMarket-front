import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import instance from "../axios/axiosInstance";

export default function AdminProducts() {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [showAll]);

  const loadProducts = async () => {
    try {
      const { data } = await instance.get(showAll ? "/products" : `/products/search/${keyword}`);
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleCheckboxChange = () => {
    setShowAll(!showAll);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!showAll) await loadProducts();
  };

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names}`} subTitle="Admin Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Productos</div>

            <form className="d-flex mb-3" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar producto"
                value={keyword}
                onChange={handleSearchChange}
                disabled={showAll}
              />
              <button className="btn btn-outline-primary ms-2" type="submit" disabled={showAll}>
                Buscar
              </button>
              <div className="form-check ms-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showAll}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label">Mostrar todos</label>
              </div>
            </form>

            {products?.map((p) => (
              <Link key={p.id} to={`/dashboard/admin/product/update/${p.id}`}>
                <div className="card mb-3 col-md-7">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="img img-fluid rounded-start"
                        style={{ height: "175px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{p?.name} Q{p?.price}</h5>
                        <p className="card-text">
                          {p?.description?.substring(0, 160)}
                        </p>
                        <p className="card-text">Marca: {p.brand.name}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            {moment(p.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
