import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import CardFormAnonimo from "../forms/CardFormAnonimo";
import instance from "../../pages/axios/axiosInstance";

export default function UserCartSidebar({ cartTotal }) {
  const [auth] = useAuth(); // Estado de autenticación
  const [cart, setCart] = useCart(); // Estado del carrito
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false); // Manejo del modo anónimo
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState(null); // Datos de la tarjeta para autenticado

  const navigate = useNavigate();

  // Estados del formulario de envío (modo anónimo)
  const [names, setNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("0");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // Escenario 2: Obtener tarjeta desde API para usuario autenticado
  useEffect(() => {
    if (paymentMethod === "card" && auth.id) {
      const selectedCardId = localStorage.getItem("selectedCardId");
      if (selectedCardId) {
        axios
          .get(`/api/credit-cards/${selectedCardId}`)
          .then((response) => setCardData(response.data))
          .catch(() => toast.error("No se pudo obtener la tarjeta."));
      }
    }
  }, [paymentMethod, auth.id]);

  const handleBuy = async (cardDetails = null) => {
    try {
      setLoading(true);

      let customerId = auth.id; // ID del cliente autenticado
      if (!auth.id && anonymous) {
        // Crear cliente anónimo si el usuario no está autenticado
        const { data } = await axios.post("/api/customers", {
          names,
          lastNames,
          phoneNumber,
          address,
          email,
          status,
        });
        customerId = data.id;
      }

      const orderPayload = {
        customerId,
        orderDetails: cart.map((product) => ({
          productId: product.id,
          qty: product.quantity,
        })),
        paymentMethod,
        cardData: cardDetails || cardData, // Enviar los datos de tarjeta
        total: parseFloat(cartTotal().replace(/[^0-9.-]+/g, "")),
        status: "Creado",
      };

      await instance.post("/orders/checkout", orderPayload);

      // Limpiar el carrito y redirigir
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Pedido realizado con éxito");
    } catch (err) {
      console.error("Error durante el proceso de pago", err);
      toast.error("Hubo un error en el proceso de pago.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!auth.id && !anonymous) return false;
    if (anonymous && (!names || !lastNames || !phoneNumber || !address || !email)) {
      return false;
    }
    if (paymentMethod === "card" && !auth.id && !cardData) {
      return false;
    }
    return true;
  };

  return (
    <div className="col-md-4 mb-5">
      <h4>Resumen de tu carrito</h4>
      <hr />
      <h6>Total: {cartTotal()}</h6>

      {!auth.id ? (
        <>
          <button
            className="btn btn-outline-danger mt-3"
            onClick={() => navigate("/login", { state: "/cart" })}
          >
            Iniciar sesión para checkout
          </button>

          <div className="mt-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            <label className="ms-2">Continuar como anónimo</label>
          </div>

          {anonymous && (
            <div className="mt-3">
              <h5>Información de Envío</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombres"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Apellidos"
                value={lastNames}
                onChange={(e) => setLastNames(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Teléfono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
        </>
      ) : (
        <div className="mb-3">
          <h5>Tus datos:</h5>
          <p><strong>Nombre:</strong> {auth.names} {auth.lastNames}</p>
          <p><strong>Teléfono:</strong> {auth.phoneNumber}</p>
          <p><strong>Dirección:</strong> {auth.address}</p>
          <p><strong>Email:</strong> {auth.email}</p>
        </div>
      )}

      <div className="mt-3">
        <h5>Método de Pago</h5>
        <div>
          <input
            type="radio"
            name="payment"
            value="cash"
            onChange={() => setPaymentMethod("cash")}
            required
          />
          <label className="ms-2">Pago en efectivo contra entrega</label>
        </div>
        <div className="mt-2">
          <input
            type="radio"
            name="payment"
            value="card"
            onChange={() => {
              setPaymentMethod("card");
              setShowCardForm(true);
            }}
            required
          />
          <label className="ms-2">Tarjeta de crédito / débito</label>
        </div>

        {showCardForm && !auth.id && (
          <CardFormAnonimo onSubmit={handleBuy} />
        )}
      </div>

      <button
        onClick={() => handleBuy()}
        className="btn btn-primary col-12 mt-3"
        disabled={!isFormValid() || loading}
      >
        {loading ? "Procesando..." : "Comprar"}
      </button>
    </div>
  );
}
