import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Search from "../forms/Search";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  FaHome,
  FaStoreAlt,
  FaList,
  FaCartPlus,
  FaUser,
  FaDoorOpen,
  FaClipboard,
  FaPen,
  FaKey
} from "react-icons/fa";

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  // hooks
  const categories = useCategory();
  const navigate = useNavigate();

  // console.log("categories in menu => ", categories);

  const logout = () => {
    setAuth({ ...auth, id: null, names: "" ,address: "",status: null });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/">
           {/*
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2zwjB9-QOTXLPmmBFgrG4WadlJH-g9qFPRQ&s"  width="70" height="20"/>
            */}
           <FaHome fontSize="large"/> INICIO 
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/shop">
          <FaStoreAlt fontSize="large"/> TIENDA
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/categories">
          <FaList fontSize="large"/> CATEGORIAS 
          </NavLink>
        </li>


        <li className="nav-item mt-1">
          <Badge
            count={cart?.length >= 1 ? cart.length : 0}
            offset={[-5, 11]}
            showZero={true}
          >
            <NavLink className="nav-link" aria-current="page" to="/cart">
            <FaCartPlus fontSize="large"/> CARRITO
            </NavLink>
          </Badge>
        </li>

        <Search />

        {!auth?.id ? (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
              <FaKey fontSize="large"/> INICIAR SESION
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
              <FaPen fontSize="large"/>  REGISTRO
              </NavLink>
            </li>
          </>
        ) : (
          <div className="dropdown">
            <li>
              <a
                className="nav-link pointer dropdown-toggle"
                data-bs-toggle="dropdown"
              >
              <FaUser fontSize="large"/> {auth?.names?.toUpperCase()}
              </a>

              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    className="nav-link"
                    to={`/dashboard/${
                      auth?.status == 1 ? "admin" : "user"
                    }`}
                  >
                   <FaClipboard   fontSize="large"/> Dashboard
                  </NavLink>
                </li>

                <li className="nav-item pointer">
                  <a onClick={logout} className="nav-link">
                  <FaDoorOpen fontSize="large"/> Cerrar sesión
                  </a>
                </li>
              </ul>
            </li>
          </div>
        )}
      </ul>
    </>
  );
}
