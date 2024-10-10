import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";
import instance from "../../pages/axios/axiosInstance";

export default function UserCartSidebar() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  // state
  const [clientToken, setClientToken] = useState("");
  const [instance2, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  // hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.names) {
      getClientToken();
    }
  }, [auth?.names]);

  const getClientToken = async () => {
    try {
      //const { data } = await instance.get("/braintree/token");
      //setClientToken(data.clientToken);
      setClientToken("True");
    } catch (err) {
      console.log(err);
    }
  };

  const cartTotal = () => {
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "GTQ",
    });
  };

  const handleBuy = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance2.requestPaymentMethod();
      //   console.log("nonce => ", nonce);
      const { data } = await instance.post("/braintree/payment", {
        nonce,
        cart,
      });
      //   console.log("handle buy response => ", data);
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment successful");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="col-md-4 mb-5">
      <h4>Resumen de tu carrito</h4>
      Total / Dirección / Método de pago
      <hr />
      <h6>Total: {cartTotal()}</h6>
      {auth?.address ? (
        <>
          <div className="mb-3">
            <hr />
            <h4>Dirección de entrega:</h4>
            <h5>{auth?.address}</h5>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate("/dashboard/user/profile")}
          >
            Actualizar dirección
          </button>
        </>
      ) : (
        <div className="mb-3">
          {auth?.names ? (
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate("/dashboard/user/profile")}
            >
              Agregar dirección de entrega
            </button>
          ) : (
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() =>
                navigate("/login", {
                  state: "/cart",
                })
              }
            >
              Iniciar sesión para checkout
            </button>
          )}
        </div>
      )}
      <div>{JSON.stringify(clientToken)}</div>
      <div className="mt-3">
       {/* {!clientToken || !cart?.length ? (*/}
       {!cart?.length ? (
          ""
        ) : (
          <>
            <DropIn
              options={{
                authorization: true,
                
              }}
              //onInstance={(instance2) => setInstance(instance2)}
            />
            <button
              onClick={handleBuy}
              className="btn btn-primary col-12 mt-2"
              disabled={!auth?.address  || loading}
            >
              {loading ? "Processing..." : "Comprar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
