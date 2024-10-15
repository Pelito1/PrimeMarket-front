import React, { useState, useEffect } from "react";

export default function CardForm({ cardDetails, setCardDetails, isEdit, customerId }) {
  const [details, setDetails] = useState({
    type: "",
    ccNumber: "",
    ccDueDate: "",
    ccName: "",
    status: "",
    customerId: customerId || "", // Asegura que el customerId esté presente
    ...cardDetails,
  });

  useEffect(() => {
    if (cardDetails) {
      setDetails((prev) => ({
        ...prev,
        ...cardDetails,
        customerId: customerId || prev.customerId, // Asegurar que el customerId no se pierda
      }));
    }
  }, [cardDetails, customerId]);

  const handleInputChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusUpdate = () => {
    const today = new Date();
    const [day, month, year] = details.ccDueDate.split("/").map(Number);
    const dueDate = new Date(year, month - 1, day);

    const status = dueDate < today ? "I" : "A";
    setDetails((prev) => ({ ...prev, status }));
  };

  const handleSubmit = () => {
    handleStatusUpdate(); // Actualizar el estado antes de guardar
    setCardDetails(details); // Enviar los detalles con el customerId incluido
  };

  return (
    <div className="mt-3">
      <h5>{isEdit ? "Editar Tarjeta" : "Nueva Tarjeta"}</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Tipo de Tarjeta"
        value={details.type}
        onChange={(e) => handleInputChange("type", e.target.value)}
        required
      />
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
        placeholder="Nombre del Titular"
        value={details.ccName}
        onChange={(e) => handleInputChange("ccName", e.target.value)}
        required
      />
      <button className="btn btn-primary mt-2" onClick={handleSubmit}>
        Guardar
      </button>
    </div>
  );
}
