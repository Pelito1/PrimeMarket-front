import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import instance from "../axios/axiosInstance";
import moment from "moment";

export default function UserOrders() {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth?.id) fetchOrders();
  }, [auth?.id]);

  const fetchOrders = async () => {
    try {
      const { data } = await instance.get(`/orders/customer/${auth?.id}`);
      const detailedOrders = await Promise.all(
        data.map(async (order) => {
          const details = await fetchOrderDetails(order.id);
          const customer = await fetchCustomer(order.customerId);
          return { ...order, details, customer };
        })
      );
      setOrders(detailedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    const { data } = await instance.get(`/orders/${orderId}/details`);
    const products = await Promise.all(
      data.map(async (item) => {
        const productData = await fetchProduct(item.productId);
        return { ...productData, qty: item.qty };
      })
    );
    return products;
  };

  const fetchCustomer = async (customerId) => {
    const { data } = await instance.get(`/customers/${customerId}`);
    return data;
  };

  const fetchProduct = async (productId) => {
    const { data } = await instance.get(`/products/${productId}`);
    return data;
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Órdenes</div>
            {orders.length === 0 ? (
              <p>No hay órdenes disponibles.</p>
            ) : (
              <div className="row">
                {orders.map((order) => (
                  <div key={order.id} className="col-12 mb-4">
                    <OrderReceipt order={order} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function OrderReceipt({ order }) {
  return (
    <div className="border rounded-4 shadow-sm p-4 bg-white">
      <h4 className="text-center mb-4">Recibo de Orden #{order.id}</h4>
      <div className="d-flex justify-content-between mb-3">
        <span><strong>Fecha:</strong> {moment(order.purchaseDate, "DD/MM/YYYY").format("LL")}</span>
        <span><strong>Total:</strong> Q {order.total} </span>
        <span><strong>Estatus:</strong> {order.status}</span>
      </div>
      <hr />
      <h5>Información del Cliente</h5>
      <div className="row">
        <div className="col-md-6">
          <p><strong>Nombre:</strong> {order.customer.names} {order.customer.lastNames}</p>
          <p><strong>Teléfono:</strong> {order.customer.phoneNumber}</p>
        </div>
        <div className="col-md-6">
          <p><strong>Dirección:</strong> {order.customer.address}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
        </div>
      </div>

      <hr />

      <h5>Productos</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.details.map((product, index) => (
            <tr key={index}>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.qty}</td>
              <td>{product.price} Q</td>
              <td>{(product.qty * product.price).toFixed(2)} Q</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end">
        <strong>Total Orden: Q {order.total} </strong>
      </div>
    </div>
  );
}
