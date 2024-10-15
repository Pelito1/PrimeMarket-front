import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import instance from "./axios/axiosInstance";

export default function Home() {
  const [seasons, setSeasons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = async () => {
    try {
      const { data } = await instance.get("/seasons");
      console.log("Data recibida:", data);

      const activeSeasons = data.filter((season) => {
        const currentDate = new Date();
        const endDate = parseDate(season.endDate);

        if (season.status === '1' && endDate >= currentDate) {
          return true;
        }

        if (season.status === '1' && endDate < currentDate) {
          updateSeasonStatus(season.id);
        }
        return false;
      });

      setSeasons(activeSeasons);
    } catch (err) {
      console.error("Error al cargar las temporadas:", err);
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const updateSeasonStatus = async (id) => {
    try {
      await instance.put(`/seasons/${id}/status`, { status: 0 });
    } catch (err) {
      console.error("Error al actualizar el estado de la temporada:", err);
    }
  };

  return (
    <div>
      <Jumbotron title="PrimeMarket" subTitle="Bienvenidos a nuestra Tienda en línea" />
      <div className="container p-3">
        <div className="row">
          {seasons.length > 0 ? (
            seasons.map((season) => (
              <div
                className="col-md-3 mb-3"
                key={season.id}
                onClick={() => navigate(`/season/${season.id}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  overflow: "hidden",
                  
                  display: "flex",
                  flexDirection: "column",
                  height: "350px",
                  margin: 0, // Elimina margen lateral innecesario
                }}
              >
                {/* Imagen */}
                <div
                  style={{
                    backgroundImage: `url(${season.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "60%",
                    width: "100%", // Asegura que ocupe todo el ancho disponible
                    borderTopLeftRadius: "10px",  
                    borderTopRightRadius: "10px",
                  }}
                ></div>

                {/* Texto */}
                <div
                  style={{
                    backgroundColor: "#333", // Fondo sólido gris
                    color: "#fff",
                    padding: "15px",
                    height: "40%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomLeftRadius: "10px", 
                    borderBottomRightRadius: "10px",
                    margin: 0, // Elimina márgenes internos
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "10px",
                      fontWeight: "bold",
                      color: "yellow", // Título en amarillo
                    }}
                  >
                    {season.name}
                  </h3>
                  <p style={{ margin: 0, textAlign: "center" }}>
                    {season.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay temporadas activas en este momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}
