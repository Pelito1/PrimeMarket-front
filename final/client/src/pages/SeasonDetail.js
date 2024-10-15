import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import instance from "./axios/axiosInstance";
import Jumbotron from "../components/cards/Jumbotron";

export default function SeasonDetail() {
  const { seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSeasonDetails();
    loadProducts();
  }, []);

  const loadSeasonDetails = async () => {
    try {
      const { data } = await instance.get(`/seasons/${seasonId}`);
      setSeason(data);
      console.log("datos season:", season);
    } catch (err) {
      console.error("Error al cargar la temporada:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await instance.get(`/seasons/${seasonId}/products`);
      setProducts(data);
    } catch (err) {
      console.error("Error al cargar los productos:", err);
    }
  };

  return (
    <div>
      <Jumbotron title="PrimeMarket" subTitle="Bienvenidos a nuestra Tienda en línea" />
    <div className="container">
      {season && (
        <h1 className="text-center my-4"> Productos en Temporada {season.name}</h1>
        
      )}
      
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-3" key={product.id}>
            <ProductCard p={product} />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
