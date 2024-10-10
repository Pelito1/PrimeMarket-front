import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    id: null,
    names: "",
    lastNames: "",
    phoneNumber: null,
    address: "",
    status:null,
    email:""
  });

  // axios config
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.names;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({ ...auth, id: parsed.id, names: parsed.names, 
        lastNames: parsed.lastNames, phoneNumber: parsed.phoneNumber,
        address: parsed.address,status: parsed.status,email: parsed.email });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
