import { useState, useEffect } from "react";
//import moment from "moment";
import Jumbotron from "../components/cards/Jumbotron";
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
  const [marcas, setMarcas] = useState([]);
  // hooks
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      //const { data } = await axios.get(`/product/${params.slug}`);
      const { data } = await instance.get(`/products/${params.slug}`);
      setProduct(data);
      loadRelated(data.id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadRelated = async (productId) => {
    try {
      const { data } = await instance.get(`/categories/products/${productId}/categories`);
      const firstId = data[data.length - 1]?.id;
      const marcasVector =data.map(item => item.name);
      setMarcas(marcasVector);
      console.log(marcasVector);
      if (data && data.length > 0) {
        const { data } = await instance.get(`/categories/${firstId}/products`);
        setRelated(data);
      }
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid bg-light">
      <Jumbotron title="PrimeMarket" subTitle="Bienvenidos a nuestra Tienda en línea"/>
      <div className="row">

       {/* Espacio vacío a la izquierda */} <div className="col-md-2"></div>
        <div className="col-md-5 p-3">
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
                  style={{ height: "300px", width: "80%", objectFit: "contain" }}
                />
              </Badge.Ribbon>
           {/* </Badge.Ribbon>*/} 

            <div className="card-body">
              <h3 className="fw-bold mb-1">{product?.name}</h3>
              <p className="card-text lead mb-2" style={{ fontSize: "0.875rem" }}>{product?.description}</p>
            </div>
            <div className="d-flex justify-content-between lead p-4 bg-light fw-bold">
              <div>
                <p className="mb-1">
                  <FaMoneyBill/> Precio:{" "}
                  {product?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "GTQ",
                  })}
                </p>

                <p className="mb-1">
                  <FaProjectDiagram /> Categoria: {marcas.join(" , ")}
                </p>

                <p className="mb-1">
                  <FaBarcode /> Marca: {product?.brand?.name}
                </p>

                <p className="mb-1">
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
{/* Espacio vacío a la izquierda */}
<div className="col-md-1"></div>
        <div className="col-md-3 ml-auto p-3" style={{ maxHeight: "800px", overflowY: "auto" ,marginLeft: "auto"}}   >
          
          <h2>Productos Relacionados</h2>
          <hr />
          {related?.length < 1 && <p>Ningun resultado</p>}
          {related?.map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
