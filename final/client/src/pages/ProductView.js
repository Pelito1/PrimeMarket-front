import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge } from "antd";
import {
  FaProjectDiagram,
  FaCheck,
  FaTimes,
  FaWarehouse,
  FaMoneyBill ,
  FaBarcode,
  FaCartPlus
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import instance from "./axios/axiosInstance";

export default function ProductView() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  // hooks
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      //const { data } = await axios.get(`/product/${params.slug}`);
      const { data } = await instance.get(`/products/1`);
      setProduct(data);
      loadRelated(data.id, data.category._id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            {/*<Badge.Ribbon text={`${product?.sold} 45vendidos`} color="red">*/}
              <Badge.Ribbon
                text={`${
                  product?.stock >= 1
                    ? `${product?.stock} en existencias`
                    : "No hay existencias"
                }`}
                placement="start"
                color="black"
              >
                <img
                  className="card-img-top"
                  //src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  src={product.image}
                  alt={product.name}
                  style={{ height: "300px", width: "80%", objectFit: "cover" }}
                />
              </Badge.Ribbon>
           {/* </Badge.Ribbon>*/} 

            <div className="card-body">
              <h1 className="fw-bold">{product?.name}</h1>
              <p className="card-text lead">{product?.description}</p>
            </div>

            <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
              <div>
                <p>
                  <FaMoneyBill/> Precio:{" "}
                  {product?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "GTQ",
                  })}
                </p>

                <p>
                  <FaProjectDiagram /> Categoria: {product?.category?.name}
                </p>

                <p>
                  <FaBarcode /> Marca: {product.brand}
                </p>

                <p>
                  <FaWarehouse /> Disponible {product?.stock} existencias  {product?.stock > 0 ? <FaCheck /> : <FaTimes />}{" "} 
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button"
              style={{
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
              }}
              onClick={() => {
                setCart([...cart, product]);
                toast.success("Añadido al carrito");
              }}
            >
              Agregar a Carrito  <FaCartPlus fontSize="large"/>
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <h2>Productos Relacionados</h2>
          <hr />
          {related?.length < 1 && <p>Ningun resultado</p>}
          {related?.map((p) => (
            <ProductCard p={p} key={p._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
