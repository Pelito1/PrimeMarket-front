import { useState, useEffect } from "react";
import instance from "../pages/axios/axiosInstance";

export default function useCategoryData() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await instance.get("/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProductsByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const { data } = await instance.get(`/categories/${categoryId}/products`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    
    // Filtrar las subcategorías
    const subCategoriesData = categories.filter(
      (c) => c.parentCategoryId === category.id
    );
    setSubCategories(subCategoriesData);
    
    // Evitar recargar productos si ya fueron cargados para la misma categoría
    if (products.length === 0 || selectedCategory?.id !== category.id) {
      await loadProductsByCategory(category.id);
    }
  };

  return {
    categories,
    subCategories,
    products,
    selectedCategory,
    isLoading,
    handleCategoryClick,
  };
}
