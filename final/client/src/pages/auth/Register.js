import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // state
  const [names, setName] = useState("");
  const [lastNames,setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("0");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // hooks
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/register`, {
        names,
        lastNames,
        phoneNumber,
        address,
        status,
        email,
        password,
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        toast.success("Registro exitoso");
        navigate("/dashboard/user");
      }
    } catch (err) {
      console.log(err);
      toast.error("Registro fallido. Intente nuevamente.");
    }
  };

  console.log(process.env.REACT_APP_API);
  return (
    <div>
      <Jumbotron title="PrimeMarket" subTitle="Registro de Usuario" />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Ingrese nombres"
                value={names}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />

              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Ingrese apellidos"
                value={lastNames}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Ingrese teléfono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Ingrese dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

            {/* 
             <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Ingrese status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              />
              */
            }

              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Ingrese correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Ingresa contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-primary" type="submit">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
