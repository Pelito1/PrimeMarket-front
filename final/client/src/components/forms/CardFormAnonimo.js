import React, { useState, useEffect } from "react";

export default function CardFormAnonimo({ onChange }) {
  const [details, setDetails] = useState({
    cvv: "",
    ccNumber: "",
    ccDueDate: "",
    ccName: "",
    status: "",
  });

  // Esta función actualiza los detalles y también notifica al componente padre
  const handleInputChange = (field, value) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onChange(newDetails); // Envía los cambios al componente principal
  };

  const validateDueDate = () => {
    const today = new Date();
    const [day, month, year] = details.ccDueDate.split("/").map(Number);
    const dueDate = new Date(year, month - 1, day);
    return !isNaN(dueDate) && dueDate > today;
  };

  const handleStatusUpdate = () => {
    const status = validateDueDate() ? "A" : "I";
    // Si la fecha es incorrecta, mostrar pop-up y limpiar el campo de fecha
    if (status === "I") {
      //alert("Fecha incorrecta");
      setDetails((prev) => ({ ...prev, ccDueDate: "" }));  // Limpiar el campo de fecha
    }

    setDetails((prev) => {
      const newDetails = { ...prev, status };
      onChange(newDetails); // Envía los cambios al componente principal
      return newDetails;
    });
  };

  useEffect(() => {
    handleStatusUpdate(); // Validar y enviar los detalles iniciales al cargar el componente
  }, []);

  return (
    <form className="mt-3">
      <h5>Información de Tarjeta</h5>
     
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Número de Tarjeta"
        value={details.ccNumber}
        onChange={(e) =>
          handleInputChange("ccNumber", e.target.value.replace(/\D/g, "").slice(0, 16))
        }
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Fecha de Expiración (dd/MM/yyyy)"
        value={details.ccDueDate}
        onChange={(e) => handleInputChange("ccDueDate", e.target.value)}
        onBlur={handleStatusUpdate} // Validar la fecha de expiración
        required
      />
       <input
        type="text"
        className="form-control mb-2"
        placeholder="CVV"
        value={details.cvv}
        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))} // Solo permite 3 números
        required
      />

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del Titular"
        value={details.ccName}
        onChange={(e) => handleInputChange("ccName", e.target.value)}
        required
      />
    </form>
  );
}
