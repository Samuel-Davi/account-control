'use client'

//modals
import { Categories } from "@/app/models/Categories";
import { Transaction } from "@/app/models/Transaction";

//layout imports
import { motion } from 'framer-motion'
import Span from "@/app/components/Span";
import addImg from '../../../../../public/assets/images/icons8-add-24.png'
import delImg from '../../../../../public/assets/images/trash.png'
import edtImg from '../../../../../public/assets/images/pen.png'
import ChoiceBox from "@/app/components/ChoiceBox";

//react imports
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/app/contexts/AuthContext";

//other imports
import { format, parse } from "date-fns";
import { api } from "@/app/lib/api";
import { getCookie } from "cookies-next";
import Loading from "@/app/components/Loading";

export default function Transactions(){

    const { user } = useContext(AuthContext)
    
    //api data
    const [transactions, setTransactions] = useState<Array<Transaction>>();
    const [categories, setCategories] = useState<Array<Categories>>();

    //modal controller
    const [isOpen, setIsOpen] = useState(false)
    const [editIsOpen, setEditIsOpen] = useState(false)
    const [deleteIsOpen, setDeleteIsOpen] = useState(false)
    const [transactionId, setTransactionId] = useState(0)

    //add form controller
    const {handleSubmit } = useForm();
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState<number | null> (0.0)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [categoryType, setCategoryType] = useState(false)

    //edit form controller
    const [editDate, setEditDate] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    const [editCategoryId, setEditCategoryId] = useState<number>(0)
    const [editDescription, setEditDescription] = useState('')
    const [editAmount, setEditAmount] = useState<number | null>(0.0)

    const fetchs = async () => {
        setLoading(true)
        const token = getCookie("account_token")
        await fetch(`${api}/getTransactions`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: "include"
  
        })
        .then(response => response.json())
        .then(data => setTransactions(data.transactions))
        .catch(error => console.error('Error:', error));

        await fetch(`${api}/getCategories`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => setCategories(data.categories))
        .catch(error => console.error('Error:', error));

        
        setLoading(false)
    }

    useEffect(() => {
        fetchs()
    }, [])

    const getCategory = (category_id: number) => {
        const category = categories?.find(c => c.id === category_id)
        return category?.name?? "N/A";
    }

    //botao add acionado
    const addTransaction = () => {
        setIsOpen(true)
    }
    //botao edit acionado
    const editTransaction = async (
        transaction_id: number,
        transaction_desc:string,
        transaction_categoryId:number, 
        transaction_amount:string,
        transaction_date: Date
    ) => {
        setEditAmount(parseFloat(transaction_amount))
        setEditCategoryId(transaction_categoryId)
        setEditDescription(transaction_desc)
        setTransactionId(transaction_id)
        setEditDate(format(transaction_date, "yyyy-MM-dd'T'HH:mm"))
        setEditIsOpen(true)
    }

    //editar transação
    const updateTransaction = async () => {
        if(!editAmount || !editDescription || !editCategoryId || !editDate){
            alert("Preencha os dados corretamente")
        }else{
            const dateObj = parse(editDate, "yyyy-MM-dd'T'HH:mm", new Date());
            console.log("data: ", dateObj)
            const response = await fetch(`${api}/updateTransaction`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: editDescription,
                    amount: editAmount,
                    category_id: editCategoryId !== 0 ? editCategoryId : 14,
                    transaction_date: dateObj,
                    user_id: user?.id,
                    id: transactionId
                })
            })
            if (response.ok) {
                fetchs(); // Atualiza os dados sem precisar recarregar a página
            }else{
                console.error("Erro ao atualizar");
            }
            setEditIsOpen(false)
        }
    }

    //criar transação
    const createTransaction = async () => {
        setLoading(true)
        if(!amount || selectedIndex === 0 || description === ""){
            setLoading(false)
            alert("Preencha os dados corretamente!!!")
        }else{
            const response = await fetch(`${api}/createTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: description,
                    amount: amount,
                    category_id: selectedIndex !== 0 ? selectedIndex : 14,
                    user_id: user?.id
                })
            })
            if (response.ok) {
                setAmount(0.0)
                setDescription("")
                fetchs(); // Atualiza os dados sem precisar recarregar a página
              } else {
                console.error("Erro ao atualizar");
              }
            setLoading(false)
            setIsOpen(false)
        }
    }
    //deletar transação
    const deleteTransaction = async () => {
        const response = await fetch(`${api}/deleteTransaction?id=${transactionId}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            fetchs(); // Atualiza os dados sem precisar recarregar a página
        } else {
            console.error("Erro ao deletar");
        }
        setDeleteIsOpen(false)
    }

    return (
        <div className="flex h-4/5 flex-col items-center">
            <div className="h-5/6 w-4/5 bg-white shadow-md p-4 m-4">
                <div className="border-b pb-2 mb-2">
                    <h2 className="text-gray-700 font-medium">Transaction History - {user?.name}</h2>

                </div>
                <div className="flex justify-between items-center text-sm py-2">
                    <span className="w-36 text-center">Date</span>
                    <span className="w-36 text-center">Description</span>
                    <span className="hidden sm:block w-36 text-center">Category</span>
                    <span className="w-36 text-center">Amount</span>
                    <span className="w-36 text-center">Options</span>
                </div>
                <div className="h-5/6 overflow-auto">
                    {transactions?.map(transaction => (
                        <div key={transaction.id} className="flex justify-between items-center text-sm py-2">
                            <span className="w-36 text-center">{new Date(transaction.transaction_date).toLocaleString("pt-BR")}</span>
                            <span className="w-36 text-center">{transaction.description}</span>
                            <span className="hidden sm:block w-36 text-center">{getCategory(transaction.category_id)}</span>
                            <span className="w-36 text-center"><Span category_id={transaction.category_id} value={transaction.amount.toString() + "R$"}></Span></span>
                            <div className="w-36 text-center">
                                <button onClick={() => {
                                        editTransaction(
                                            transaction.id,
                                            transaction.description, 
                                            transaction.category_id, 
                                            transaction.amount.toString(),
                                            new Date(transaction.transaction_date)
                                        )
                                    }} className="border-4 border-white bg-blue-400 text-white rounded-xl p-1 hover:bg-blue-600">
                                    <img className="w-6" src={edtImg.src} alt="edit" />
                                </button>
                                <button onClick={() => {
                                    setTransactionId(transaction.id)
                                    setDeleteIsOpen(true)
                                }} className="border-4 border-white bg-red-600 text-white rounded-xl p-1 hover:bg-red-700">
                                    <img className="w-6" src={delImg.src} alt="del" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={addTransaction} className="fixed bottom-8 rounded-md bg-purple-800 p-1 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                <img src={addImg.src} alt="img" />
            </button>
            {/* add modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4"
                >
                    <h2 className="text-center text-xl font-bold mb-4">Add Transaction</h2>
                    <form onSubmit={handleSubmit(createTransaction)} className="h-5/6 flex flex-col justify-around items-center">
                        <label className="w-4/5 block">
                            Valor:
                            <input
                            type="Number"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Digite o valor"
                            value={amount ? amount : 0}
                            onChange={(e) => {setAmount(e.target.valueAsNumber)}}
                            />
                        </label>
                        <label className="block font-medium">Escolha uma categoria:</label>

                        <div className="flex w-4/5 justify-around">
                            <div className="flex w-1/3 justify-around">
                                <input 
                                checked={!categoryType} 
                                type="radio" 
                                name="gastos" 
                                id="gastos" 
                                onChange={() => setCategoryType(prev => !prev)}/>
                                <p>Gastos</p>
                            </div>

                            <div className="flex w-1/3 justify-around">
                                <input 
                                checked={categoryType}
                                onChange={() => setCategoryType(prev => !prev)}
                                type="radio" 
                                name="ganhos" 
                                id="ganhos" />
                                <p>Ganhos</p> 
                            </div>
                        </div>

                        <ChoiceBox preCategoryType={categoryType === false ? 0 : 1} setState={setSelectedIndex}/>                 

                        <label className="w-4/5 block">
                            Descrição:
                            <input
                            type="text"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Digite a descrição"
                            value={description}
                            onChange={(e) => {setDescription(e.target.value)}}
                            />
                        </label>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 border rounded-md"
                            >
                            Cancelar
                            </button>
                            <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                            Enviar
                            </button>
                        </div>
                    </form>
                </motion.div>
                </div>
            )}
            {/* edit modal */}
            {editIsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4"
                >
                    <h2 className="text-center text-xl font-bold mb-4">Edit Transaction</h2>
                    <form onSubmit={handleSubmit(updateTransaction)} className="h-5/6 flex flex-col justify-around items-center">
                        <label className="w-4/5 block">
                            Valor:
                            <input
                            type="Number"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Digite o valor"
                            value={editAmount ? editAmount : 0}
                            onChange={(e) => {setEditAmount(e.target.valueAsNumber)}}
                            />
                        </label>

                        <ChoiceBox preCategory={editCategoryId} preCategoryType={editCategoryId === 6 ? 1 : 0} setState={setEditCategoryId}/>                 

                        <label className="w-4/5 block">
                            Descrição:
                            <input
                            type="text"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Digite a descrição"
                            value={editDescription}
                            onChange={(e) => {setEditDescription(e.target.value)}}
                            />
                        </label>

                        <label>
                            Data:
                            <input
                            type="datetime-local"
                            className="w-full border p-2 rounded mt-1"
                            value={editDate}
                            onChange={(e) => {setEditDate(e.target.value)}}
                            />
                        </label>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                            type="button"
                            onClick={() => setEditIsOpen(false)}
                            className="px-4 py-2 border rounded-md"
                            >
                            Cancelar
                            </button>
                            <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                            Enviar
                            </button>
                        </div>
                    </form>
                </motion.div>
                </div>
            )}
            {/* delete modal */}
            {deleteIsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white p-6 rounded-lg shadow-lg w-96 h-1/4"
                >
                    <h2 className="text-center text-xl font-bold mb-4">Delete Transaction</h2>
                    
                    <div className="flex justify-center gap-2 mt-4">
                            <button
                            type="button"
                            onClick={() => setDeleteIsOpen(false)}
                            className="px-4 py-2 border rounded-md"
                            >
                            Cancelar
                            </button>
                            <button
                            onClick={() => deleteTransaction()}
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                            Deletar
                            </button>
                        </div>
                </motion.div>
                </div>
            )}
            {loading && (<Loading/>)}
        </div>
    );
}