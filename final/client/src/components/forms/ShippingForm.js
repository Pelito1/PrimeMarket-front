import React from "react";

export default function ShippingForm({ names, setNames, lastNames, setLastNames, phoneNumber, setPhoneNumber, address, setAddress, email, setEmail }) {
  return (
    <div className="mt-3">
      <h5>Información de Envío</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombres"
        value={names}
        onChange={(e) => setNames(e.target.value)}
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Apellidos"
        value={lastNames}
        onChange={(e) => setLastNames(e.target.value)}
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Teléfono"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="email"
        className="form-control mb-2"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
  );
}
