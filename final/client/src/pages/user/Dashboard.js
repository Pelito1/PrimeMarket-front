import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";

export default function UserDashboard() {
  // context
  const [auth, setAuth] = useAuth();

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names}`} subTitle="Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light"> Información de Usuario</div>

            <ul className="list-group">
              <li className="list-group-item">{auth?.names}</li>
              <li className="list-group-item">{auth?.address}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
