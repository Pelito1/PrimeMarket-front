import { Badge } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { FaCartPlus } from "react-icons/fa";

export default function ProductCard({ p }) {
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita la navegación al hacer clic en el botón

    const productInCart = cart.find((item) => item.id === p.id);

    if (productInCart) {
      navigate("/cart");
      toast.info("Este producto ya está en tu carrito.");
    } else {
      const updatedCart = [...cart, { ...p, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Producto agregado al carrito.");
    }
  };

  return (
    <div
      className="card mb-3 hoverable"
      onClick={() => navigate(`/product/${p.id}`)}
      style={{ cursor: "pointer" }}
    >
      <Badge.Ribbon
        text={p.stock > 0 ? `${p.stock} en existencias` : "Agotado"}
        placement="start"
        color={p.stock > 0 ? "black" : "red"}
      >
        <img
          className="card-img-top"
          src={p.image}
          alt={p.name}
          style={{ height: "150px", objectFit: "contain" }}
        />
      </Badge.Ribbon>

      <div className="card-body">
        <h5>{p.name.substring(0, 30)}</h5>
        <h4 className="fw-bold">
          {p.price.toLocaleString("en-US", {
            style: "currency",
            currency: "GTQ",
          })}
        </h4>
        <p className="card-text">{p.description.substring(0, 60)}...</p>
      </div>

      <button
        className="btn btn-outline-dark col card-button"
        style={{
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
        }}
        onClick={handleAddToCart}
        disabled={p.stock === 0}
      >
        {p.stock > 0 ? (
          <>
            Agregar a Carrito <FaCartPlus fontSize="large" />
          </>
        ) : (
          "Agotado"
        )}
      </button>
    </div>
  );
}
