import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";
import instance from "../axios/axiosInstance";

export default function UserProfile() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [names, setName] = useState("");
  const [lastNames, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.names) {
     // const { name, email, address } = auth.user;
      setName(auth?.names);
      setLastName(auth?.lastNames)
      setEmail(auth?.email);
      setAddress(auth?.address);
      setPhoneNumber(auth?.phoneNumber);

    }
  }, [auth?.names]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Hacer el PUT y registrar la respuesta en la consola
    console.log(await instance.put(`/customers/${auth?.id}`, {
      names,
      lastNames,
      phoneNumber,
      address,
      password,
      
    }));

     // Realizar un GET para obtener el cliente actualizado
    const { data } = await instance.get(`/customers/${auth?.id}`);

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth,  id: data.id, names: data.names,  address: data.address,status: data.status,email: data.email });
        // local storage update
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Perfil actualizado");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names}`} subTitle="Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Editar Perfil</div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Ingrese su nombre"
                value={names}
                onChange={(e) => setName(e.target.value)}
                autoFocus={true}
              />

              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Ingrese su apellidos"
                value={lastNames}
                onChange={(e) => setLastName(e.target.value)}
              />

              <input
                type="email"
                className="form-control m-2 p-2"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />

              <input
                type="password"
                className="form-control m-2 p-2"
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <textarea
                className="form-control m-2 p-2"
                placeholder="Ingrese dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Ingrese su telefono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <button className="btn btn-primary m-2 p-2">Actualizar datos</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
