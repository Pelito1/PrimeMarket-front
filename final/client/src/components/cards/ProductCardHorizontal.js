import moment from "moment";
import { useCart } from "../../context/cart";
import {
  FaTrashAlt,
  
} from "react-icons/fa";

export default function ProductCardHorizontal({ p, remove = true }) {
  // context
  const [cart, setCart] = useCart();

  const removeFromCart = (productId) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item.id === productId);
    myCart.splice(index, 1);
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
  };

  return (
    <div
      className="card mb-3 ms-auto"
      style={{ maxWidth: 540 }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            //src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
            src={p.image}
            alt={p.name}
            style={{
              height: "100px",
              width: "150px",
              objectFit: "cover",
              marginLeft: "-12px",
              borderRopRightRadius: "0px",
            }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              {p.name}{" "}
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "GTQ",
              })}
            </h5>
            <p className="card-text">{`${p?.description?.substring(
              0,
              50
            )}..`}</p>
            <p className="card-text ">Disponible: {p.stock} unidades </p>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <p className="card-text">
            <small className="text-muted">
              Listed {moment(p.createdAt).fromNow()}
            </small>
          </p>
          {remove && (
            <p
              className="text-danger mb-2 pointer"
              onClick={() => removeFromCart(p.id)}
            >
              Eliminar  <FaTrashAlt fontSize="large"/>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
