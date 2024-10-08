import { useState, useEffect } from "react";
import instance from "../pages/axios/axiosInstance";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

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

  return categories;
}
