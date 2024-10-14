import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import Jumbotron from "../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import UserCartSidebar from "../components/cards/UserCartSidebar";
import ProductCardHorizontal from "../components/cards/ProductCardHorizontal";

export default function Cart() {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const cartTotal = () => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "GTQ",
      });
  };

  const emptyCartMessage = (
    <div className="text-center">
      <button
        className="btn btn-primary"
        onClick={() => navigate("/")}
      >
        Continuar comprando
      </button>
    </div>
  );

  return (
    <>
      <Jumbotron
        title={`Bienvenido ${auth?.names || "Usuario"}`}
        subTitle={
          cart.length
            ? `Tienes ${cart.length} productos en el carrito.`
            : "El carrito está vacío"
        }
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
              {cart.length ? "Mi Carrito" : emptyCartMessage}
            </div>
          </div>
        </div>
        {cart.length > 0 && (
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {cart.map((p, index) => (
                  <ProductCardHorizontal key={index} p={p} />
                ))}
              </div>
            </div>
            <UserCartSidebar cartTotal={cartTotal} />
          </div>
        )}
      </div>
    </>
  );
}
