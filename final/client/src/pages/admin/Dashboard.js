import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";

export default function AdminDashboard() {
  // context
  const [auth, setAuth] = useAuth();

  return (
    <>
      <Jumbotron
        title={`Bienvenido ${auth?.names}`}
        subTitle="Admin Dashboard"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Admin Información</div>

            <ul className="list-group">
              <li className="list-group-item">Nombres: {auth?.names}</li>
              <li className="list-group-item">Apellidos: {auth?.lastNames}</li>
              <li className="list-group-item">Celular: {auth?.phoneNumber}</li>
              <li className="list-group-item">Dirección: {auth?.address}</li>
              <li className="list-group-item ">Administrador</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
