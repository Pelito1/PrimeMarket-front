import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import instance from "../../pages/axios/axiosInstance";
import CardFormAnonimo from "../forms/CardFormAnonimo";

export default function UserCartSidebar({ cartTotal }) {
  const [auth] = useAuth(); // Estado de autenticación
  const [cart, setCart] = useCart(); // Estado del carrito
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false); // Manejo del modo anónimo
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cards, setCards] = useState([]); // Tarjetas del usuario autenticado
  const [selectedCardId, setSelectedCardId] = useState(null); // Tarjeta seleccionada por el usuario
  const [cardDetails, setCardDetails] = useState(null); // Detalles de la tarjeta para usuarios no autenticados

  const navigate = useNavigate();

  // Estados del formulario de envío (modo anónimo)
  const [names, setNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("0");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // Obtener tarjetas registradas si el usuario está logueado y selecciona "Tarjeta"
  useEffect(() => {
    if (paymentMethod === "card" && auth.id) {
      axios
        .get(`/api/credit-cards/customer/${auth.id}`)
        .then((response) => setCards(response.data))
        .catch(() => toast.error("No se pudieron cargar las tarjetas registradas."));
    }
  }, [paymentMethod, auth.id]);

  // Función para manejar la compra cuando el botón "Comprar" es presionado
  const handleBuy = async () => {
    try {
      setLoading(true);

      let customerId = auth.id;
      if (!auth.id && anonymous) {
        // Crear cliente anónimo
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

      if (paymentMethod === "cash") {
        // Escenario de pago en efectivo contra entrega
        const orderPayload = {
          customerId,
          orderDetails: cart.map((product) => ({
            productId: product.id,
            qty: product.quantity,
          })),
          paymentMethod,
          total: parseFloat(cartTotal().replace(/[^0-9.-]+/g, "")),
          status: "Creado",
        };

        await instance.post("/orders/checkout", orderPayload);

        // Limpiar el carrito y redirigir
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success("Pedido realizado con éxito");
      } else if (paymentMethod === "card") {
        let cardToProcess = null;

        if (auth.id && selectedCardId) {
          // Si el usuario está logueado y seleccionó una tarjeta registrada
          const { data: selectedCard } = await axios.get(`/api/credit-cards/${selectedCardId}`);
          cardToProcess = selectedCard;
        } else if (!auth.id && cardDetails) {
          // Si el usuario no está logueado y llenó el formulario de tarjeta
          cardToProcess = cardDetails;
        }

        if (!cardToProcess) {
          toast.error("Por favor, selecciona una tarjeta o completa el formulario.");
          setLoading(false);
          return;
        }
        const formatDate = (dateString) => {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month}-${day}`;  // Convertir a yyyy-MM-dd
        };


        // Validar la tarjeta
        const cardResponse = await axios.post(`http://localhost:8081/api/credit-cards/validate`, {
          ccNumber: cardToProcess.ccNumber,
          ccDueDate: formatDate(cardToProcess.ccDueDate),
          cvv: cardToProcess.cvv,
        }, {
          params: {
            amount: parseFloat(cartTotal().replace(/[^0-9.-]+/g, ""))  // Enviando "amount" como query parameter
          }
      });
      

        if (cardResponse.data !== "Aprobado") {
          toast.error("La tarjeta no fue aprobada");
          setLoading(false);
          return;
        }

        // Crear el pedido
        const orderPayload = {
          customerId,
          orderDetails: cart.map((product) => ({
            productId: product.id,
            qty: product.quantity,
          })),
          paymentMethod,
          cardData: cardToProcess,
          total: parseFloat(cartTotal().replace(/[^0-9.-]+/g, "")),
          status: "Creado",
        };

        await instance.post("/orders/checkout", orderPayload);

        // Procesar el pago
        await axios.post(`http://localhost:8081/api/credit-cards/process`, {
          ccNumber: cardToProcess.ccNumber,
          ccDueDate: formatDate( cardToProcess.ccDueDate),
          cvv: cardToProcess.cvv
        }, {
          params: {
            amount: parseFloat(cartTotal().replace(/[^0-9.-]+/g, ""))  // Enviando "amount" como query parameter
          }
      });

        // Limpiar el carrito y redirigir
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success("Pedido realizado con éxito");
      }
    } catch (err) {
      console.error("Error durante el proceso de pago", err);
      toast.error("Hubo un error en el proceso de pago.");
    } finally {
      setLoading(false);
    }
  };

  // Verifica si el formulario es válido para habilitar el botón de compra
  const isFormValid = () => {
    if (!auth.id && !anonymous) return false;
    if (anonymous && (!names || !lastNames || !phoneNumber || !address || !email)) {
      return false;
    }
    if (paymentMethod === "card" && !auth.id && !cardDetails) {
      return false;
    }
    return true;
  };

  // Detectar si el método de pago es tarjeta y controlar el formulario de tarjeta
  useEffect(() => {
    if (paymentMethod === "card") {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  }, [paymentMethod]);

  // Renderizar la selección de tarjetas registradas
  const renderCardSelection = () => {
    return (
      <select
        onChange={(e) => setSelectedCardId(e.target.value)} // Actualizar tarjeta seleccionada
        value={selectedCardId || ""}
        className="form-select mb-3"
      >
        <option value="">Selecciona una tarjeta</option>
        {cards.map((card) => (
          <option key={card.id} value={card.id}>
            **** **** **** {card.ccNumber.slice(-4)}
          </option>
        ))}
      </select>
    );
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
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Eliminar cualquier carácter no numérico
                  if (value.length <= 8) {
                    setPhoneNumber(value); // Solo permitir hasta 8 dígitos
                  }
                }}
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
            onChange={() => setPaymentMethod("card")}
            required
          />
          <label className="ms-2">Tarjeta de crédito / débito</label>
        </div>

        {/* Mostrar formulario de tarjeta solo si se selecciona tarjeta */}
        {showCardForm && !auth.id && (
          <CardFormAnonimo onChange={(details) => setCardDetails(details)} />
        )}

        {/* Mostrar tarjetas registradas para usuarios logueados */}
        {showCardForm && auth.id && cards.length > 0 && renderCardSelection()}
      </div>

      <button
        onClick={handleBuy}
        className="btn btn-primary col-12 mt-3"
        disabled={!isFormValid() || loading}
      >
        {loading ? "Procesando..." : "Comprar"}
      </button>
    </div>
  );
}
