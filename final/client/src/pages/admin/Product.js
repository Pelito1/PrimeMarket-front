import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import instance from "../axios/axiosInstance";

const { Option } = Select;

export default function AdminProductCreate() {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [brand, setBrand] = useState("");
  const [brandName, setBrandName] = useState("");
  const [stock, setStock] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await instance.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadBrands = async () => {
    try {
      const { data } = await instance.get("/brands");
      setBrands(data);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  const isFormValid = () => {
    return name && description && price && stock && category && brand && imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        description,
        price,
        brand: {
          id: brand,
          name: brandName,
        },
        image: imageUrl,
        stock,
      };

      const { data } = await instance.post(`/products`, productData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" ha sido creado exitosamente.`);
        navigate("/dashboard/admin/products");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("No se pudo crear el producto. Inténtelo de nuevo.");
    }
  };

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names}`} subTitle="Admin Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-6">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Crear Producto</div>

            {imageUrl && (
              <div className="text-center mb-3">
                <img src={imageUrl} alt="Product" className="img img-responsive" height="175px" />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Imagen URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese URL de imagen"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escriba un nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  placeholder="Escriba una descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Precio</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ingrese un precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Existencias</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Ingrese existencias"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Marca</label>
                <Select
                  className="form-select"
                  value={brand}
                  onChange={(value, option) => {
                    setBrand(value);
                    setBrandName(option.children);
                  }}
                  placeholder="Seleccione una marca"
                  required
                >
                  {brands.map((b) => (
                    <Option key={b.id} value={b.id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid()}
              >
                Crear
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
