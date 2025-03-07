interface CheckboxProps {
    name: string;
    label: string;
    isChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function Checkbox({ label, name, onChange, isChecked }: CheckboxProps) {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={onChange}
          className="w-5 h-5 text-white cursor-pointer rounded-xl"
        />
        <p className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">{label}</p>
      </label>
    );
  }
  