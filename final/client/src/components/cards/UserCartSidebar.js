import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserCartSidebar({ cartTotal }) {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);
      // Simular proceso de pago
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Pago realizado con éxito");
    } catch (err) {
      console.error("Error durante el pago", err);
      setLoading(false);
      toast.error("Hubo un error en el proceso de pago.");
    }
  };

  return (
    <div className="col-md-4 mb-5">
      <h4>Resumen de tu carrito</h4>
      <hr />
      <h6>Total: {cartTotal()}</h6>
      {auth?.address ? (
        <>
          <div className="mb-3">
            <h5>Dirección de entrega:</h5>
            <p>{auth.address}</p>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/dashboard/user/profile")}
          >
            Actualizar dirección
          </button>
        </>
      ) : (
        <button
          className="btn btn-outline-danger mt-3"
          onClick={() => navigate("/login", { state: "/cart" })}
        >
          Iniciar sesión para checkout
        </button>
      )}
      <button
        onClick={handleBuy}
        className="btn btn-primary col-12 mt-2"
        disabled={!auth?.address || loading}
      >
        {loading ? "Procesando..." : "Comprar"}
      </button>
    </div>
  );
}
