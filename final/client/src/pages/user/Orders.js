import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import moment from "moment";
import ProductCardHorizontal from "../../components/cards/ProductCardHorizontal";
import instance from "../axios/axiosInstance";

export default function UserOrders() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth?.names) getOrders();
  }, [auth?.names]);

  const getOrders = async () => {
    try {
      const { data } = await instance.get(`/orders/customer/${auth?.id}`);
      setOrders(data);
      console.log(orders);
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Ordenes</div>

            {orders?.map((o, i) => {
              return (
                <div
                  key={o.id}
                  className="border shadow bg-light rounded-4 mb-5"
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Comprador</th>
                        <th scope="col">Realizado</th>
                        <th scope="col">Pago</th>
                        <th scope="col">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Tarjeta" : "Contra entrega"}</td>
                        <td>{o?.products?.length} products</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container">
                    <div className="row m-2">
                      {o?.products?.map((p, i) => (
                        <ProductCardHorizontal key={i} p={p} remove={false} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
