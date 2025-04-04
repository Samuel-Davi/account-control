'use client'

//modals
import { Categories } from "@/app/models/Categories";
import { Transaction } from "@/app/models/Transaction";

//layout imports
import Span from "@/app/components/Span";
import addImg from '../../../../../public/assets/images/icons8-add-24.png'
import delImg from '../../../../../public/assets/images/trash.png'
import edtImg from '../../../../../public/assets/images/pen.png'
import refreshImg from '../../../../../public/assets/images/refresh2.png'
import clearImg from '../../../../../public/assets/images/eraser.png'
import { ChevronLeft, ChevronRight } from "lucide-react";

//react imports
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

//other imports
import { format, parse } from "date-fns";
import { api } from "@/app/lib/api";
import { getCookie } from "cookies-next";
import Loading from "@/app/components/Loading";
import { AddComponent, DeleteComponent, EditComponent } from "@/app/components/TransactionsComponents";
import ChoiceBox from "@/app/components/ChoiceBox";

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

    //search controllers
    const [searchDescription, setSearchDescription] = useState("")
    const [transactionsFiltered, setTransactionsFiltered] = useState<Array<Transaction>>()
    const [indexFiltered, setIndexFiltered] = useState<number>(0)
    const [categoryTypeFiltered, setCategoryTypeFiltered] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isFirst, setIsFirst] = useState(true)
    const [isLast, setIsLast] = useState(false)

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

    ////filtragens
    useEffect(() => {
        setTransactionsFiltered(transactions)
    }, [transactions, setTransactions])

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollWidth } = scrollRef.current;
            const amount = scrollWidth; 
          scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
        }
      };

    //filtragem por descrição
    useEffect(() => {
        const filteredTransactions = transactions?.filter(t => 
            t.description.toLowerCase().includes(searchDescription.toLowerCase())
        )
        setTransactionsFiltered(filteredTransactions)
    }, [searchDescription, setSearchDescription, setTransactionsFiltered])

    //filtragem por categoria
    useEffect(() => {
        if(indexFiltered !== 0){
            const filteredTransactions = transactions?.filter(t => 
                t.category_id === indexFiltered
            )
            setTransactionsFiltered(filteredTransactions)
        }else{
            setTransactionsFiltered(transactions)
        }
    }, [indexFiltered, setIndexFiltered])

    return (
        <div className="flex h-full flex-col items-center">
            <div className="h-[75%] md:h-[70%] w-4/5 bg-white shadow-md p-4 m-4">
                <div className="h-[10%] border-b">
                    <h2 className="text-gray-700 font-medium">Histórico de Transação - {user?.name}</h2>
                </div>

                <div className="w-full flex justify-between gap-1">
                    <button className={`${isFirst? "hidden" : ""} md:hidden bg-white shadow-md rounded-full`} onClick={() => {
                        scroll("left")
                        setIsLast(prev => !prev)
                        setIsFirst(prev => !prev)
                    }}>
                        <ChevronLeft />
                    </button>

                    <div ref={scrollRef}  className='border-b h-[12%] max-w-[85%] md:min-w-[100%] no-scroll scroll-smooth scrollbar-hide overflow-x-auto flex justify-around items-center'>
                        <div className="min-w-[100%] md:min-w-[50%] flex justify-center">
                            <input
                                type="text"
                                className="md:w-[60%] w-full border p-1 rounded"
                                placeholder="Pesquisar..."
                                value={searchDescription}
                                onChange={(e) => {setSearchDescription(e.target.value)}}
                            />
                        </div>
                        <div className="min-w-[100%] md:min-w-[50%] flex justify-center gap-2 items-center">
                            <img onClick={() => {
                                setIndexFiltered(0)
                            }} className="w-6 h-6 cursor-pointer" src={clearImg.src} alt="clear" />
                            <div className="flex items-center justify-center">
                                <ChoiceBox state={indexFiltered} preCategoryType={categoryTypeFiltered === false ? 0 : 1} setState={setIndexFiltered}/>
                            </div> 
                            <img onClick={() => {
                                setIndexFiltered(!categoryTypeFiltered ? 6 : 1)
                                setCategoryTypeFiltered(prev => !prev)
                            }} className="cursor-pointer w-4 h-4" src={refreshImg.src} alt="refresh" />
                        </div>                
                    </div>
                    
                    <button className={`${isLast ? "hidden" : ""} md:hidden bg-white shadow-md rounded-full`} onClick={() => {
                        scroll("right")
                        setIsLast(prev => !prev)
                        setIsFirst(prev => !prev)
                    }}>
                        <ChevronRight />
                    </button>
                </div>

                <div className="flex h-[10%] justify-between items-center text-sm border-b">
                    <span className="w-1/5 text-center">Descrição</span>
                    <span className="hidden sm:block w-1/5 text-center">Categoria</span>
                    <span className="w-1/5 text-center">Valor</span>
                    <span className="w-1/5 text-center">Data</span>
                    <span className="w-1/5 text-center">Opções</span>
                </div>
                <div className="h-[68%] overflow-auto">
                    {transactionsFiltered?.map(transaction => (
                        <div key={transaction.id} className="flex justify-between items-center text-sm border-b py-1">
                            <span className="w-1/5 overflow-auto lg:border-r text-center">{transaction.description}</span>
                            <span className="hidden sm:block w-1/5 lg:border-r text-center">{getCategory(transaction.category_id)}</span>
                            <span className="w-1/5 lg:border-r text-center"><Span category_id={transaction.category_id} value={transaction.amount.toString() + "R$"}></Span></span>
                            <span className="w-1/5 overflow-auto lg:border-r text-center">{new Date(transaction.transaction_date).toLocaleString("pt-BR")}</span>
                            <div className="w-1/5 lg:border-r text-center">
                                <button onClick={() => {
                                        editTransaction(
                                            transaction.id,
                                            transaction.description, 
                                            transaction.category_id, 
                                            transaction.amount.toString(),
                                            new Date(transaction.transaction_date)
                                        )
                                    }} className="border-4 border-white bg-blue-400 text-white rounded-xl p-1 hover:bg-blue-600">
                                    <img className="w-5" src={edtImg.src} alt="edit" />
                                </button>
                                <button onClick={() => {
                                    setTransactionId(transaction.id)
                                    setDeleteIsOpen(true)
                                }} className="border-4 border-white bg-red-600 text-white rounded-xl p-1 hover:bg-red-700">
                                    <img className="w-5" src={delImg.src} alt="del" />
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
                <AddComponent
                categoryType={categoryType}
                setCategoryType={setCategoryType}
                amount={amount}
                setAmount={setAmount}
                description={description}
                setDescription={setDescription}
                createTransaction={createTransaction}
                setSelectedIndex={setSelectedIndex}
                setIsOpen={setIsOpen}
                />
            )}
            {/* edit modal */}
            {editIsOpen && (
                <EditComponent
                editAmount={editAmount}
                setEditAmount={setEditAmount}
                editCategoryId={editCategoryId}
                editDescription={editDescription}
                setEditDescription={setEditDescription}
                editDate={editDate}
                setEditDate={setEditDate}
                setEditIsOpen={setEditIsOpen}
                updateTransaction={updateTransaction}
                setEditCategoryId={setEditCategoryId}
                />
            )}
            {/* delete modal */}
            {deleteIsOpen && (
                <DeleteComponent
                setDeleteIsOpen={setDeleteIsOpen}
                deleteTransaction={deleteTransaction}
                />
            )}
            {loading && (<Loading/>)}
        </div>
    );
}