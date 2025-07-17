interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const Input = ({ label, value, onChange, min, max }: InputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex justify-between items-center">
        <span className="text-gray-700">{label}</span>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-24 px-2 py-1 text-right border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      <input
        type="range"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default Input;
