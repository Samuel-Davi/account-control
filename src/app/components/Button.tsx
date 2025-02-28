interface ButtonProps{
    text: string;
    type?: string;
    onClick?: () => void;
}

export default function Button({text, type, onClick}: ButtonProps){
    return (
        <button 
        className="px-4 py-2 w-3/4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-white hover:text-blue-400 transition"
        onClick={onClick} 
        type="submit"
        >
            {text}
        </button>
    );
}