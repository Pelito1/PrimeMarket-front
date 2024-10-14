import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import { useCart } from "../../context/cart";
import instance from "../../pages/axios/axiosInstance";
import toast from "react-hot-toast";

export default function ProductCardHorizontal({ p, remove = true }) {
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(p.quantity || 1);
  const [stock, setStock] = useState(p.stock);

  const fetchUpdatedProduct = async (productId) => {
    try {
      const { data } = await instance.get(`/products/${productId}`);
      setStock(data.stock);
      return data.stock;
    } catch (error) {
      console.error("Error al obtener el stock actualizado", error);
      toast.error("No se pudo actualizar la información del stock.");
    }
  };

  const handleIncrement = async () => {
    const updatedStock = await fetchUpdatedProduct(p.id);
    if (quantity < updatedStock) {
      setQuantity(quantity + 1);
      updateCart(p.id, quantity + 1);
    } else {
      toast.error("No hay suficiente stock disponible.");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateCart(p.id, quantity - 1);
    }
  };

  const updateCart = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="card mb-3 ms-auto" style={{ maxWidth: 540 }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={p.image}
            alt={p.name}
            style={{
              height: "100px",
              width: "150px",
              objectFit: "contain",
              marginLeft: "-12px",
            }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              {p.name}{" "}
              {p.price.toLocaleString("en-US", {
                style: "currency",
                currency: "GTQ",
              })}
            </h5>
            <p className="card-text">{`${p.description.substring(0, 50)}...`}</p>
            <p className="card-text">Disponible: {stock} unidades</p>

            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={handleDecrement}
                disabled={quantity <= 1 || stock === 0}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={handleIncrement}
                disabled={quantity >= stock || stock === 0}
              >
                +
              </button>
            </div>

            <p className="mt-2">
              Subtotal:{" "}
              {(p.price * quantity).toLocaleString("en-US", {
                style: "currency",
                currency: "GTQ",
              })}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <small className="text-muted">
            Listed {moment(p.createdAt).fromNow()}
          </small>
          {remove && (
            <p
              className="text-danger mb-2 pointer"
              onClick={() => removeFromCart(p.id)}
            >
              Eliminar <FaTrashAlt fontSize="large" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
