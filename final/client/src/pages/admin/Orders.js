import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { Modal, Button, Select, message } from "antd";
import moment from "moment";
import instance from "../axios/axiosInstance";

const { Option } = Select;

export default function AdminOrders() {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [visibleOrder, setVisibleOrder] = useState(null);
  const [status, setStatus] = useState(["Creado", "Empacado", "En ruta", "Entregado"]);
  const [changedStatus, setChangedStatus] = useState("");

  useEffect(() => {
    if (auth?.names) getOrders();
  }, [auth?.names]);

  const getOrders = async () => {
    try {
      const { data } = await instance.get("/orders");
      const detailedOrders = await Promise.all(
        data.map(async (order) => {
          const customer = await fetchCustomer(order.customerId);
          const details = await fetchOrderDetails(order.id);
          return { ...order, customer, details };
        })
      );
      setOrders(detailedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchCustomer = async (customerId) => {
    try {
      const { data } = await instance.get(`/customers/${customerId}`);
      return data || {};
    } catch (err) {
      console.error("Error fetching customer:", err);
      return {};
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const { data } = await instance.get(`/orders/${orderId}/details`);
      const productsWithDetails = await Promise.all(
        data.map(async (item) => {
          const product = await fetchProduct(item.productId);
          return { ...product, qty: item.qty };
        })
      );
      return productsWithDetails;
    } catch (err) {
      console.error("Error fetching order details:", err);
      return [];
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const { data } = await instance.get(`/products/${productId}`);
      return data || {};
    } catch (err) {
      console.error("Error fetching product:", err);
      return {};
    }
  };

  const handleStatusChange = async (orderId, value) => {
    setChangedStatus(value);
    try {
      await instance.put(`/order-status/${orderId}`, { status: value });
      message.success("Estado actualizado");
      getOrders();
    } catch (err) {
      message.error("Error al actualizar estado");
      console.error(err);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await instance.delete(`/orders/${orderId}`);
      message.success("Orden eliminada");
      getOrders();
    } catch (err) {
      message.error("Error al eliminar la orden");
      console.error(err);
    }
  };

  const openOrder = (order) => setVisibleOrder(order);
  const closeOrder = () => setVisibleOrder(null);

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names || "Administrador"}`} subTitle="Dashboard" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Órdenes</div>
            {orders.length === 0 ? (
              <p>No hay órdenes disponibles.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded p-2 mb-2 bg-light"
                  onClick={() => openOrder(order)}
                  style={{ cursor: "pointer" }}
                >
                  <p><strong>Recibo de Orden #{order.id}</strong></p>
                  <p>
                    <strong>Fecha:</strong> {moment(order.purchaseDate, "DD/MM/YYYY").format("LL")} &nbsp;&nbsp;
                    <strong>Total:</strong> Q {order.total}  &nbsp;&nbsp;
                    <strong>Estatus:</strong> {order.status} &nbsp;&nbsp;
                    <strong>Cliente:</strong> {order.customer?.names || "Desconocido"}
                  </p>
                </div>
              ))
            )}

            {visibleOrder && (
              <Modal
                visible={true}
                title={`Recibo de Orden #${visibleOrder.id}`}
                onCancel={closeOrder}
                footer={[
                  <Button key="delete" danger onClick={() => deleteOrder(visibleOrder.id)}>
                    Eliminar
                  </Button>,
                  <Button
                    key="update"
                    type="primary"
                    disabled={!changedStatus}
                    onClick={() => handleStatusChange(visibleOrder.id, changedStatus)}
                  >
                    Actualizar
                  </Button>,
                ]}
              >
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Fecha:</strong> {moment(visibleOrder.purchaseDate, "DD/MM/YYYY").format("LL")}</span>
                  <span><strong>Total:</strong> Q {visibleOrder.total} </span>
                  <span><strong>Estatus:</strong></span>
                  <Select
                    defaultValue={visibleOrder.status}
                    onChange={(value) => setChangedStatus(value)}
                    style={{ width: 120 }}
                  >
                    {status.map((s, index) => (
                      <Option key={index} value={s}>
                        {s}
                      </Option>
                    ))}
                  </Select>
                </div>

                <h5>Información del Cliente</h5>
                <p><strong>Nombre:</strong> {visibleOrder.customer?.names || "N/A"} {visibleOrder.customer?.lastNames || ""}</p>
                <p><strong>Teléfono:</strong> {visibleOrder.customer?.phoneNumber || "N/A"}</p>
                <p><strong>Dirección:</strong> {visibleOrder.customer?.address || "N/A"}</p>
                <p><strong>Email:</strong> {visibleOrder.customer?.email || "N/A"}</p>

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
                    {visibleOrder.details.map((product, index) => (
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
                        <td>Q {product.price} </td>
                        <td>Q {(product.qty * product.price).toFixed(2)} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
