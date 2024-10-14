import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../components/cards/Jumbotron";
import { Badge } from "antd";
import {
  FaProjectDiagram,
  FaCheck,
  FaTimes,
  FaWarehouse,
  FaMoneyBill,
  FaBarcode,
  FaCartPlus,
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import instance from "./axios/axiosInstance";

export default function ProductView() {
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [marcas, setMarcas] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  // Cargar los detalles del producto al montar el componente
  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async () => {
    try {
      const { data } = await instance.get(`/products/${params.slug}`);
      setProduct(data);
      loadRelated(data.id);
    } catch (err) {
      console.error("Error al cargar el producto:", err);
    }
  };

  const loadRelated = async (productId) => {
    try {
      const { data } = await instance.get(
        `/categories/products/${productId}/categories`
      );
      const firstId = data[data.length - 1]?.id;
      const marcasVector = data.map((item) => item.name);
      setMarcas(marcasVector);

      if (data.length > 0) {
        const relatedProducts = await instance.get(
          `/categories/${firstId}/products`
        );
        setRelated(relatedProducts.data);
      }
    } catch (err) {
      console.error("Error al cargar productos relacionados:", err);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que el clic navegue al detalle del producto

    const productInCart = cart.find((item) => item.id === product.id);

    if (productInCart) {
      navigate("/cart");
      toast.info("Este producto ya está en tu carrito.");
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Producto añadido al carrito.");
    }
  };

  return (
    <div className="container-fluid bg-light">
      <Jumbotron
        title="PrimeMarket"
        subTitle="Bienvenidos a nuestra Tienda en línea"
      />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-5 p-3">
          <div className="card mb-3">
            <Badge.Ribbon
              text={
                product.stock > 0 ? `${product.stock} en existencias` : "Agotado"
              }
              placement="start"
              color={product.stock > 0 ? "black" : "red"}
            >
              <img
                className="card-img-top"
                src={product.image}
                alt={product.name}
                style={{ height: "300px", width: "80%", objectFit: "contain" }}
              />
            </Badge.Ribbon>

            <div className="card-body">
              <h3 className="fw-bold mb-1">{product.name}</h3>
              <p className="card-text lead mb-2" style={{ fontSize: "0.875rem" }}>
                {product.description}
              </p>
            </div>

            <div className="d-flex justify-content-between lead p-4 bg-light fw-bold">
              <div>
                <p className="mb-1">
                  <FaMoneyBill /> Precio:{" "}
                  {product.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "GTQ",
                  })}
                </p>
                <p className="mb-1">
                  <FaProjectDiagram /> Categoría: {marcas.join(", ")}
                </p>
                <p className="mb-1">
                  <FaBarcode /> Marca: {product?.brand?.name}
                </p>
                <p className="mb-1">
                  <FaWarehouse /> Disponible: {product.stock}{" "}
                  {product.stock > 0 ? <FaCheck /> : <FaTimes />}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button"
              style={{
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
              }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? (
                <>
                  Agregar a Carrito <FaCartPlus fontSize="large" />
                </>
              ) : (
                "Agotado"
              )}
            </button>
          </div>
        </div>

        <div className="col-md-1"></div>

        <div
          className="col-md-3 ml-auto p-3"
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          <h2>Productos Relacionados</h2>
          <hr />
          {related.length < 1 && <p>No hay productos relacionados</p>}
          {related.map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
