'use client'

import { useEffect, useState } from "react";
import { Categories } from "../models/Categories";
import { api } from "../lib/api";

interface ChoiceBoxProps {
    setState: React.Dispatch<React.SetStateAction<number>>;
    preCategory?: number;
}

export default function ChoiceBox({ setState, preCategory }: ChoiceBoxProps) {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(preCategory ? preCategory : null);

  // Buscar categorias do backend
  useEffect(() => {
    fetch(`${api}/getCategories`) // Ajuste a URL do backend
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  return (
    <div className="w-4/5">
      <label className="block font-medium">Escolha uma categoria:</label>
      <select
        value={selectedCategory || ""}
        onChange={(e) => {
            setSelectedCategory(Number(e.target.value))
            setState(Number(e.target.value))
        }}
        className="mt-1 block w-full bg-white p-2 border border-gray-300 rounded-md shadow-sm 
             focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="" disabled>Selecione uma opção</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      
    </div>
  );
}
