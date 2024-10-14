import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axios/axiosInstance";

const { Option } = Select;

export default function AdminProductUpdate() {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState();
  const [categoryText, setCategoryText] = useState("");
  const [initialCategory, setInitialCategory] = useState(); // Nueva variable para categoría original
  const [modifyCategory, setModifyCategory] = useState(false);
  const [brand, setBrand] = useState();
  const [brandText, setBrandText] = useState("");
  const [initialBrand, setInitialBrand] = useState(); // Nueva variable para marca original
  const [modifyBrand, setModifyBrand] = useState(false);
  const [stock, setStock] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await loadProductData();
      await loadAllCategories();
      await loadAllBrands();
    };
    fetchData();
  }, []);

  const loadAllCategories = async () => {
    try {
      const { data } = await instance.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadAllBrands = async () => {
    try {
      const { data } = await instance.get("/brands");
      setBrands(data);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  const loadProductData = async () => {
    try {
      const { data: productData } = await instance.get(`/products/${params.id}`);
      setName(productData.name);
      setImageUrl(productData.image);
      setDescription(productData.description);
      setPrice(productData.price);
      setStock(productData.stock);
      setId(productData.id);

      // Marca del producto
      setBrandText(productData.brand?.name || "Sin marca");
      setBrand(productData.brand?.id || null);
      setInitialBrand(productData.brand?.id || null); // Guardar marca original

      // Categoría del producto
      const { data: categoryData } = await instance.get(
        `/categories/products/${params.id}/categories`
      );
      setCategoryText(categoryData[0]?.name);
      setCategory(categoryData[0]?.id);
      setInitialCategory(categoryData[0]?.id); // Guardar categoría original
    } catch (err) {
      console.error("Error loading product or category:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        description,
        price,
        category: modifyCategory ? category : initialCategory,
        brand: modifyBrand ? brand : initialBrand,
        image: imageUrl,
        stock,
      };

      const { data } = await instance.put(`/product/${id}`, productData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" ha sido actualizado correctamente.`);
        navigate("/dashboard/admin/products");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("No se pudo actualizar el producto. Inténtelo de nuevo.");
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("¿Está seguro de que desea eliminar este producto?");
      if (!confirmDelete) return;

      const { data } = await instance.delete(`/product/${id}`);
      toast.success(`"${data.name}" ha sido eliminado.`);
      navigate("/dashboard/admin/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("No se pudo eliminar el producto. Inténtelo de nuevo.");
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
          <div className="col-md-7">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Actualizar Producto</div>

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
                />
              </div>

              <div className="mb-3">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  placeholder="Escriba una descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                />
              </div>

              <div className="mb-3">
                <label>Categoría Actual: {categoryText}</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={modifyCategory}
                    onChange={() => setModifyCategory(!modifyCategory)}
                  />
                  <label className="form-check-label">Modificar Categoría</label>
                </div>
                {modifyCategory && (
                  <Select
                    bordered={false}
                    size="large"
                    className="form-select mt-2"
                    value={category}
                    onChange={(value) => setCategory(value)}
                    placeholder="Seleccione una categoría"
                  >
                    {categories.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="mb-3">
                <label>Marca Actual: {brandText}</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={modifyBrand}
                    onChange={() => setModifyBrand(!modifyBrand)}
                  />
                  <label className="form-check-label">Modificar Marca</label>
                </div>
                {modifyBrand && (
                  <Select
                    showSearch
                    bordered={false}
                    size="large"
                    className="form-select mt-2"
                    value={brand}
                    onChange={(value) => setBrand(value)}
                    placeholder="Seleccione una marca"
                  >
                    {brands.map((b) => (
                      <Option key={b.id} value={b.id}>
                        {b.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="submit" className="btn btn-primary">
                  Actualizar
                </button>
                <button type="button" onClick={handleDelete} className="btn btn-danger">
                  Borrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
