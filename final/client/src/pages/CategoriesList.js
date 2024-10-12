import useCategoryData from "../hooks/useCategoryData";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from "../components/cards/ProductCard";

export default function CategoriesList() {
  const {
    categories,
    subCategories,
    products,
    selectedCategory,
    isLoading,
    handleCategoryClick,
  } = useCategoryData();

  return (
    <>
      <Jumbotron title="Categorías" subTitle="Listado de todas las categorías" />

      <div className="container overflow-hidden">
        <div className="row gx-4 gy-4 mt-3 mb-5">
          {categories
            .filter((c) => c.parentCategoryId === null)
            .map((c) => (
              <div className="col-md-3" key={c.id}>
                <button
                  type="button"
                  className="btn btn-outline-dark col-12 p-3"
                  style={{ borderRadius: "10px" }}
                  onClick={() => handleCategoryClick(c)}
                >
                  {c.name}
                </button>
              </div>
            ))}
        </div>

        {/* Mostrar subcategorías */}
        {selectedCategory && subCategories.length > 0 && (
          <>
            <h3>Subcategorías de {selectedCategory.name}</h3>
            <div className="row gx-4 gy-4 mt-3 mb-5">
              {subCategories.map((sub) => (
                <div className="col-md-3" key={sub.id}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary col-12 p-3"
                    style={{ borderRadius: "10px" }}
                    onClick={() => handleCategoryClick(sub)}
                  >
                    {sub.name}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mostrar productos con indicador de carga */}
        {isLoading ? (
          <div className="text-center">Cargando productos...</div>
        ) : products.length > 0 && (
          <>
            <h3> ({products.length}) Productos en {selectedCategory.name}</h3> 
            <div className="row mt-3">
              {products.map((p) => (
                <div key={p.id} className="col-md-3">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
