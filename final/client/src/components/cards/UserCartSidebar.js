import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import ShippingForm from "../forms/ShippingForm";
import CardForm from "../forms/CardForm";
import instance from "../../pages/axios/axiosInstance";

export default function UserCartSidebar({ cartTotal }) {
  const [auth] = useAuth(); // Obtener el estado de autenticación
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false); // Maneja si el usuario elige continuar como anónimo
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);

  // Estados del formulario de envío (solo para anónimo)
  const [names, setNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("0");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiration: "",
    cvv: "",
  });

  const handleBuy = async () => {
    try {
      setLoading(true);

      let customerId = auth.id; // **Uso del ID del cliente si está autenticado**
      let newCustomer = null;

      // **Verificar si es una compra anónima**
      if (!auth.id && anonymous) {
        const { data } = await axios.post("/api/customers", {
          names,
          lastNames,
          phoneNumber,
          address,
          email,
          status
        });
        customerId = data.id; // **Guardar el ID del nuevo cliente**
      }

      const orderPayload = {
        customerId, // ID del cliente
        orderDetails: cart.map((product) => ({
          productId: product.id,
          qty: product.quantity,
        })),
        paymentMethod,
        total: parseFloat(cartTotal().replace(/[^0-9.-]+/g, "")), // Asegura que sea un número
        status: "Creado", // Asegura que siempre tenga un valor
      };
      

      await instance.post("/orders/checkout", orderPayload); // **Usar endpoint unificado**

      // **Limpiar el carrito y redirigir**
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
    if (!auth.id && !anonymous) return false; // Debe iniciar sesión o continuar como anónimo
    if (anonymous && (!names || !lastNames || !phoneNumber || !address || !email)) {
      return false; // Falta información en el formulario de envío
    }
    if (paymentMethod === "card" && (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiration || !cardDetails.cvv)) {
      return false; // Falta información en el formulario de tarjeta
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
            <ShippingForm
              names={names}
              setNames={setNames}
              lastNames={lastNames}
              setLastNames={setLastNames}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              address={address}
              setAddress={setAddress}
              email={email}
              setEmail={setEmail}
            />
          )}
        </>
      ) : (
        <>
          <div className="mb-3">
            <h5>Tus datos:</h5>
            <p>
              <strong>Nombre:</strong> {auth.names} {auth.lastNames}
            </p>
            <p>
              <strong>Teléfono:</strong> {auth.phoneNumber}
            </p>
            <p>
              <strong>Dirección:</strong> {auth.address}
            </p>
            <p>
              <strong>Email:</strong> {auth.email}
            </p>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/dashboard/user/profile")}
          >
            Actualizar información
          </button>
        </>
      )}

      <div className="mt-3">
        <h5>Método de Pago</h5>
        <div>
          <input
            type="radio"
            name="payment"
            value="cash"
            onChange={() => {
              setPaymentMethod("cash");
              setShowCardForm(false);
            }}
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

        {showCardForm && (
          <CardForm cardDetails={cardDetails} setCardDetails={setCardDetails} />
        )}
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
