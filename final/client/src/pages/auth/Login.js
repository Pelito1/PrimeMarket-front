import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../axios/axiosInstance";

export default function Login() {
  // state
  const [email, setEmail] = useState("cruz@gmail.com");
  const [password, setPassword] = useState("1234567");
  // hook
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log("location => ", location);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post(`/customers/login`, {
        email,
        password,
     });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, id: data.id, names: data.names, lastNames: data.lastNames,
          phoneNumber: data.phoneNumber,
          address: data.address,status: data.status,email: data.email });
        toast.success("Inicio de sesión exitoso");
        navigate(
          location.state ||
            `/dashboard/${data?.status == 1 ? "admin" : "user"}`
        );
      }
    } catch (err) {
      //console.log(err);
      toast.error("Fallo en inicio de sesión. Intente nuevamente.");
    }
  };

  return (
    <div>
      <Jumbotron title="PrimeMarket" subTitle="Inicio de sesión" />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Ingrese correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />

              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-primary" type="submit">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
