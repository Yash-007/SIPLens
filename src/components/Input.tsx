interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
}

const Input = ({ label, value, onChange, min, max, prefix, suffix }: InputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center space-x-1">
          {prefix && <span className="text-gray-500">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            className="w-20 px-2 py-1 text-right text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {suffix && <span className="text-gray-500">{suffix}</span>}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-blue-600
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-150
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-blue-600
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:transition-all
                     [&::-moz-range-thumb]:duration-150
                     [&::-moz-range-thumb]:hover:scale-110"
        />
        <div
          className="absolute h-2 bg-blue-500 rounded-l-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{min.toLocaleString()}{suffix}</span>
        <span>{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
};

export default Input;
