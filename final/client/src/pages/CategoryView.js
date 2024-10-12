import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import instance from "./axios/axiosInstance";

export default function CategoryView() {
  // state
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  // hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProductsByCatgory();
  }, [params?.slug]);

  const loadProductsByCatgory = async () => {
    try {
     // const { data } = await instance.get(`/products-by-category/${params.slug}`);
     const { data } = await instance.get(`/categories/${params.slug}/products`);
     setProducts(data);
     if (data && data.length > 0) {
      const { data } = await instance.get(`/categories/${params.slug}`);
      setCategory(data);
      console.log(category);
  }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron
        title={category?.name}
        subTitle={`${products?.length} productos encontrados en "${category?.name}"`}
      />

      <div className="container-fluid">
        <div className="row mt-3">
          {products?.map((p) => (
            <div key={p._id} className="col-md-3">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
