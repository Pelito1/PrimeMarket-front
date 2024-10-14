import React from "react";

export default function CardForm({ cardDetails, setCardDetails }) {
  return (
    <div className="mt-3">
      <h5>Información de Tarjeta</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Número de Tarjeta"
        value={cardDetails.cardNumber}
        onChange={(e) =>
          setCardDetails({ ...cardDetails, cardNumber: e.target.value })
        }
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del Titular"
        value={cardDetails.cardName}
        onChange={(e) =>
          setCardDetails({ ...cardDetails, cardName: e.target.value })
        }
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Fecha de Expiración (MM/AA)"
        value={cardDetails.expiration}
        onChange={(e) =>
          setCardDetails({ ...cardDetails, expiration: e.target.value })
        }
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="CVV"
        value={cardDetails.cvv}
        onChange={(e) =>
          setCardDetails({ ...cardDetails, cvv: e.target.value })
        }
        required
      />
    </div>
  );
}
