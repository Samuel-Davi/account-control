'use client'

import { useEffect, useState } from "react";
import { Categories } from "../models/Categories";
import { api } from "../lib/api";
import Loading from "./Loading";

interface ChoiceBoxProps {
    setState: React.Dispatch<React.SetStateAction<number>>;
    state?: number | null;
    preCategory?: number;
    preCategoryType: number;
}

export default function ChoiceBox({setState, state = 0,  preCategory, preCategoryType }: ChoiceBoxProps) {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(preCategory ? preCategory : null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    //delayWait()
    fetch(`${api}/getCategoriesByType?type=${preCategoryType}`) // Ajuste a URL do backend
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
    
  }, [ preCategoryType ]);
  
  useEffect(() => {
    setLoading(false); 
  }, [categories])

  useEffect(() => {
    setSelectedCategory(state)
  }, [state])

  return (
    <div className="flex flex-col min-w-4/5">
      <div>
        <select
          value={selectedCategory || 0}
          onChange={(e) => {
              setSelectedCategory(Number(e.target.value))
              setState(Number(e.target.value))
          }}
          className="mt-1 w-full bg-white p-2 border border-gray-300 rounded-md shadow-sm 
              focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value={0} disabled>Selecione uma opção</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {loading && (
        <Loading/>
      )}
    </div>
  );
}
