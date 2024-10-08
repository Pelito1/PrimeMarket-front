import { Badge } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";

export default function ProductCard({ p }) {
  // context
  const [cart, setCart] = useCart();
  // hooks
  const navigate = useNavigate();

  return (
    <div className="card mb-3 hoverable"
    onClick={() => navigate(`/product/${p.slug}`)}
    style={{ cursor: "pointer" }}
    >
      
        <Badge.Ribbon
          text={`${
            p?.stock >= 1
              ? `${p?.stock} en existencias`
              : "No hay existencias"
          }`}
          placement="start"
          color="black"
        >
          <img
            className="card-img-top"
            //src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
            src={p.image}
            alt={p.name}
            style={{ height: "165px", objectFit: "cover" }}
          />
        </Badge.Ribbon>
      

      <div className="card-body">
        <h5>{p?.name}</h5>

        <h4 className="fw-bold">
          {p?.price?.toLocaleString("en-US", {
            style: "currency",
            currency: "GTQ",
          })}
        </h4>

        <p className="card-text">{p?.description?.substring(0, 60)}...</p>
      </div>

      <div className="d-flex justify-content-between">
        {/*<button
          className="btn btn-primary col card-button"
          style={{ borderBottomLeftRadius: "5px" }}
          onClick={() => navigate(`/product/${p.slug}`)}
        >
          View Product
        </button>*/}

        <button
          className="btn btn-outline-dark col card-button"
          style={{ borderBottomRightRadius: "5px",borderBottomLeftRadius: "5px", }}
          onClick={(e) => {
            e.stopPropagation(); // Evita que el evento onClick se propague al card
            setCart([...cart, p]);
            localStorage.setItem("cart", JSON.stringify([...cart, p]));
            toast.success("Agregado a carrito");
          }}
        >
          Agregar a carrito
        </button>
      </div>

      {/* <p>{moment(p.createdAt).fromNow()}</p>
      <p>{p.sold} sold</p> */}
    </div>
  );
}
