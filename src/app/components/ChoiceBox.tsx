'use client'

import { useEffect, useState } from "react";
import { Categories } from "../models/Categories";
import { api } from "../lib/api";
import Loading from "./Loading";

interface ChoiceBoxProps {
    setState: React.Dispatch<React.SetStateAction<number>>;
    preCategory?: number;
    preCategoryType: number;
}

export default function ChoiceBox({setState, preCategory, preCategoryType }: ChoiceBoxProps) {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(preCategory ? preCategory : null);
  const [loading, setLoading] = useState(false)

  const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))
  

  // Buscar categorias do backend
  useEffect(() => {
    setLoading(true)
    fetch(`${api}/getCategoriesByType?type=${preCategoryType}`) // Ajuste a URL do backend
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const delayWait = async () => {
    await delay()
  }

  useEffect(() => {
    setLoading(true);
    delayWait()
    fetch(`${api}/getCategoriesByType?type=${preCategoryType}`) // Ajuste a URL do backend
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
    
  }, [ preCategoryType ]);
  useEffect(() => {
    setLoading(false); 
  }, [categories])

  return (
    <div className="flex flex-col w-4/5">
      <div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => {
              setSelectedCategory(Number(e.target.value))
              setState(Number(e.target.value))
          }}
          className="mt-1 w-full bg-white p-2 border border-gray-300 rounded-md shadow-sm 
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
      
      {loading && (
        <Loading/>
      )}
    </div>
  );
}
