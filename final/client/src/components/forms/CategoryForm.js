import { useState } from "react";

export default function CategoryForm({
  value,
  setValue,
  handleSubmit,
  buttonText = "Registrar",
  handleDelete,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    setValue(e.target.value);
    setIsButtonDisabled(e.target.value.trim() === "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Desactiva el botón al enviar
    await handleSubmit(e);
    setIsSubmitting(false); // Reactiva el botón al finalizar
  };

  return (
    <div className="p-3">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="form-control p-3"
          placeholder="Escribe el nombre de la categoría"
          value={value}
          onChange={handleNameChange}
        />

<select
  className="form-control mt-3"
  value={selectedCategory || ""}
  onChange={(e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null; // Convertir a número o null
    setSelectedCategory(value);
  }}
>
  <option value="">Selecciona una categoría padre (opcional)</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>


        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={isButtonDisabled || isSubmitting}
          >
            {buttonText}
          </button>
          {handleDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Evita propagación del evento
                handleDelete();
              }}
              className="btn btn-danger mt-3"
            >
              Borrar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
