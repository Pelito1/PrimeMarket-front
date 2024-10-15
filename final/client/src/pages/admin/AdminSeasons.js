import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { Modal } from "antd";
import toast from "react-hot-toast";
import moment from "moment";  // Asegúrate de importar moment
import instance from "../axios/axiosInstance";

export default function AdminSeasons() {
  const [auth] = useAuth();

  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "",
    image: "",
  });

  const [updateSeason, setUpdateSeason] = useState({
    id: null,
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "",
    image: "",
  });

  const [seasons, setSeasons] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    const { name, startDate, endDate, description, status, image } = newSeason;
    setIsButtonEnabled(
      name && startDate && endDate && description && status && image
    );
  }, [newSeason]);

  const loadSeasons = async () => {
    try {
      const { data } = await instance.get("/seasons");
      const formattedSeasons = data.map((season) => ({
        ...season,
        startDate: moment(season.startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        endDate: moment(season.endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
      }));
      setSeasons(formattedSeasons);
    } catch (err) {
      console.error("Error al cargar las temporadas:", err);
    }
  };

  const handleCreateSeason = async (e) => {
    e.preventDefault();
    try {
      const formattedSeason = {
        ...newSeason,
        startDate: moment(newSeason.startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        endDate: moment(newSeason.endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
      };

      const { data } = await instance.post("/seasons", formattedSeason);
      toast.success(`Temporada "${data.name}" creada.`);
      loadSeasons();
      setNewSeason({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
        status: "",
        image: "",
      });
    } catch (err) {
      console.error("Error al crear la temporada:", err);
      toast.error("Error al crear la temporada.");
    }
  };

  const handleUpdateSeason = async () => {
    try {
      const formattedSeason = {
        ...updateSeason,
        startDate: moment(updateSeason.startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        endDate: moment(updateSeason.endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
      };

      await instance.put(`/seasons/${updateSeason.id}`, formattedSeason);
      toast.success("Temporada actualizada.");
      setVisible(false);
      loadSeasons();
    } catch (err) {
      console.error("Error al actualizar la temporada:", err);
      toast.error("No se pudo actualizar la temporada.");
    }
  };

  const handleDeleteSeason = async () => {
    try {
      await instance.delete(`/seasons/${updateSeason.id}`);
      toast.success("Temporada eliminada.");
      setVisible(false);
      loadSeasons();
    } catch (err) {
      console.error("Error al eliminar la temporada:", err);
      toast.error("No se pudo eliminar la temporada.");
    }
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Crear Temporada</div>
            <form onSubmit={handleCreateSeason}>
              <input
                type="text"
                placeholder="Nombre de la temporada"
                className="form-control mb-2"
                value={newSeason.name}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, name: e.target.value })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={newSeason.startDate}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={newSeason.endDate}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, endDate: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
                className="form-control mb-2"
                value={newSeason.description}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Estado (1 o 0)"
                className="form-control mb-2"
                value={newSeason.status}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, status: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                className="form-control mb-2"
                value={newSeason.image}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, image: e.target.value })
                }
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!isButtonEnabled}
              >
                Crear Temporada
              </button>
            </form>

            <hr />

            <div className="p-3 mt-2 mb-2 h4 bg-light">Administrar Temporadas</div>
            <div className="col">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  className="btn btn-outline-primary m-3"
                  onClick={() => {
                    setUpdateSeason({
                      id: season.id,
                      name: season.name,
                      startDate: season.startDate,
                      endDate: season.endDate,
                      description: season.description,
                      status: season.status,
                      image: season.image,
                    });
                    setVisible(true);
                  }}
                >
                  {season.name}
                </button>
              ))}
            </div>

            <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
              <input
                type="text"
                className="form-control mb-2"
                value={updateSeason.name}
                onChange={(e) =>
                  setUpdateSeason({ ...updateSeason, name: e.target.value })
                }
              />
              {/* Campos restantes */}
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={handleUpdateSeason}>
                  Actualizar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteSeason}>
                  Eliminar
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
