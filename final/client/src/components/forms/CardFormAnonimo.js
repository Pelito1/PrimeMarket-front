import React, { useState } from "react";

export default function CardFormAnonimo({ onSubmit }) {
  const [details, setDetails] = useState({
    cvv: "",
    ccNumber: "",
    ccDueDate: "",
    ccName: "",
    status: "",
  });

  const handleInputChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateDueDate = () => {
    const today = new Date();
    const [day, month, year] = details.ccDueDate.split("/").map(Number);
    const dueDate = new Date(year, month - 1, day);
    return !isNaN(dueDate) && dueDate > today;
  };

  const handleStatusUpdate = () => {
    const status = validateDueDate() ? "A" : "I";
    setDetails((prev) => ({ ...prev, status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleStatusUpdate(); // Actualiza el estado antes de enviar
    onSubmit(details); // Enviar los datos al componente padre
  };

  return (
    <form className="mt-3" onSubmit={handleSubmit}>
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
        onBlur={handleStatusUpdate} // Actualiza el estado al perder el foco
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
      <button className="btn btn-primary mt-2" type="submit">
        Enviar
      </button>
    </form>
  );
}
