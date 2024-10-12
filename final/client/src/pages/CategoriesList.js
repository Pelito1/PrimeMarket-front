import useCategory from "../hooks/useCategory";
import Jumbotron from "../components/cards/Jumbotron";
import { Link } from "react-router-dom";

export default function CategoriesList() {
  const categories = useCategory();

  return (
    <>
      <Jumbotron title="Categorías" subTitle="Listado de todas las categorías" />

      <div className="container overflow-hidden">
        <div className="row gx-4 gy-4 mt-3 mb-5">
          {categories?.map((c) => (
            <div className="col-md-3" key={c.id}>
              <button type="button" className="btn btn-outline-dark col-12 p-3 " 
              style={{ borderRadius: "10px"}}>

                <Link to={`/category/${c.id}`}  style={{
                color: "inherit", // Hereda el color del botón (blanco o negro)
              
              }}>   {c.name}
              
              </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
