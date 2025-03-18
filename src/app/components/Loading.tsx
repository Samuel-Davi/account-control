import { motion } from 'framer-motion'
import imgLoading from '../../../public/assets/images/loading.png'

export default function Loading(){
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col justify-around items-center bg-white p-6 rounded-lg shadow-lg w-48 h-1/4"
            >
                <h2>Loading...</h2>
                <img src={imgLoading.src} alt="loading" className="w-16 h-16 animate-spin" />
            </motion.div>
        </div>
    )
}