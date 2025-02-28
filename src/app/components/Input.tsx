interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
  }
  
  export default function Input({ type = "text", placeholder, value }: InputProps) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className="w-3/4 p-1 m-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    );
  }