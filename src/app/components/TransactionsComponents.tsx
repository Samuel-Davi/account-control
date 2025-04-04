import { motion } from 'framer-motion'
import ChoiceBox from './ChoiceBox';

type AddProps = {
    categoryType: boolean;
    setCategoryType: React.Dispatch<React.SetStateAction<boolean>>;
    amount: number | null;
    setAmount: React.Dispatch<React.SetStateAction<number | null>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    createTransaction: () => void;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddComponent({categoryType, setCategoryType, amount,
     setAmount, description, setDescription, createTransaction, setSelectedIndex, setIsOpen} : AddProps)
{
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/5 ld:h-3/4"
            >
                <h2 className="text-center text-xl font-bold mb-4">Adicionar Transação</h2>
                <form className="h-5/6 flex flex-col justify-around items-center">
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
                        type="button"
                        onClick={() => createTransaction()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                        Enviar
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

type EditProps = {
    editDescription: string;
    editCategoryId: number;
    editAmount: number | null;
    editDate: string;
    setEditAmount: React.Dispatch<React.SetStateAction<number | null>>;
    setEditCategoryId: React.Dispatch<React.SetStateAction<number>>;
    setEditDescription: React.Dispatch<React.SetStateAction<string>>;
    setEditDate: React.Dispatch<React.SetStateAction<string>>;
    setEditIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    updateTransaction: () => void;
}

export function EditComponent({ editAmount, setEditAmount, editCategoryId, editDescription,
    setEditDescription, editDate, setEditDate, setEditIsOpen, updateTransaction, setEditCategoryId
 }: EditProps){
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4"
                >
                    <h2 className="text-center text-xl font-bold mb-4">Editar Transação</h2>
                    <form className="h-5/6 flex flex-col justify-around items-center">
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
                            type="button"
                            onClick={() => updateTransaction()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                            Enviar
                            </button>
                        </div>
                    </form>
                </motion.div>
                </div>
    )
}

type DeleteProps = {
    setDeleteIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deleteTransaction: () => void;
}

export function DeleteComponent({setDeleteIsOpen, deleteTransaction}: DeleteProps){
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white gap-1 rounded-lg shadow-lg w-96 h-1/5 flex flex-col justify-center"
            >
                <h2 className="text-center text-xl font-bold">Deletar Transação</h2>
                
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
    )
}