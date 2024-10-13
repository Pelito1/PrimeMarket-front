import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import toast from "react-hot-toast";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal, message } from "antd";
import instance from "../axios/axiosInstance";

export default function AdminCategory() {
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatingName, setUpdatingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await instance.get("/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post("/categories", {
        name,
        parentCategoryId: selectedCategory || null,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCategories();
        setName("");
        setSelectedCategory("");
        toast.success(`"${name}" ha sido creada`);
      }
    } catch (err) {
      console.log(err);
      toast.error("No se pudo crear la categoría. Intenta de nuevo.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const parentId = selectedCategoryForUpdate || null; // Asegurar que sea null si no hay valor
  
      const { data } = await instance.put(`/categories/${selected.id}`, {
        name: updatingName,
        parentCategoryId: parentId,
      });
  
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" ha sido actualizada`);
        setSelected(null);
        setUpdatingName("");
        setSelectedCategoryForUpdate("");
        loadCategories();
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("No se pudo actualizar la categoría. Intenta de nuevo.");
    }
  };
  

  const confirmDelete = () => {
    Modal.confirm({
      title: "¿Estás seguro que deseas eliminar esta categoría?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          const { data } = await instance.delete(`/category/${selected.id}`);
          if (data?.error) {
            message.error({
              content: data.error,
              duration: 5,
              style: { marginTop: '20vh' },
            });
          } else {
            message.success({
              content: `"${data.name}" ha sido eliminada`,
              duration: 5,
              style: { marginTop: '20vh' },
            });
            setSelected(null);
            loadCategories();
            setVisible(false);
          }
        } catch (err) {
          console.log(err);
          message.error({
            content: "No se pudo eliminar la categoría. Intenta de nuevo.",
            duration: 5,
            style: { marginTop: '20vh' },
          });
        }
      },
    });
  };

  return (
    <>
      <Jumbotron title={`Bienvenido ${auth?.names}`} subTitle="Admin Dashboard" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Administrar Categorías</div>
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleSubmit}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <hr />
            <div className="col">
              {categories.map((c) => (
                <button
                  key={c._id}
                  className="btn btn-outline-primary m-3"
                  onClick={() => {
                    setVisible(true);
                    setSelected(c);
                    setUpdatingName(c.name);
                    setSelectedCategoryForUpdate(c.parentCategoryId || "");
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <Modal
              visible={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <CategoryForm
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdate}
                buttonText="Actualizar"
                handleDelete={confirmDelete}
                categories={categories}
                selectedCategory={selectedCategoryForUpdate}
                setSelectedCategory={setSelectedCategoryForUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
