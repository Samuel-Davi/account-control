interface CheckboxProps {
    name: string;
    label: string;
    defaultChecked?: boolean;
  }
  
  export default function Checkbox({ label, name, defaultChecked }: CheckboxProps) {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="w-5 h-5 text-white cursor-pointer rounded-xl"
        />
        <span className="text-white">{label}</span>
      </label>
    );
  }
  