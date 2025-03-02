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
        <span className="text-white">{label}</span>
      </label>
    );
  }
  