import { useState } from 'react';

interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  showCommas?: boolean;
}

const Input = ({ label, value, onChange, min, max, prefix, suffix, showCommas = false }: InputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas and any non-numeric characters
    const numericValue = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '');
    
    if (!numericValue) {
      setInputValue('');
      onChange(min);
      return;
    }

    const newValue = Number(numericValue);
    
    if (!isNaN(newValue)) {
      if (newValue > max) {
        setInputValue(max.toString());
        onChange(max);
      } else {
        setInputValue(numericValue);
        onChange(newValue < min ? min : newValue);
      }
    }
  };

  const handleBlur = () => {
    // Format the display value on blur
    const currentValue = Number(inputValue.replace(/,/g, ''));
    if (!isNaN(currentValue)) {
      if (currentValue > max) {
        setInputValue(formatValue(max).toString());
      } else {
        setInputValue(formatValue(value).toString());
      }
    }
  };

  const formatValue = (val: number) => {
    if (showCommas) {
      return Math.round(val).toLocaleString('en-IN');
    }
    return Math.round(val);
  };

  const isValueBelowMin = Number(inputValue.replace(/,/g, '')) < min;
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
            type={showCommas ? "text" : "number"}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-24 px-2 py-1 text-right text-sm border rounded-md focus:outline-none focus:ring-2 font-semibold
              ${isValueBelowMin 
                ? 'border-red-200 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'focus:ring-blue-500 focus:border-blue-500'}`}
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
        <span>{showCommas ? Math.round(min).toLocaleString('en-IN') : Math.round(min)} <span className='ml-[1px]'>{suffix}</span></span>
        <span>{showCommas ? Math.round(max).toLocaleString('en-IN') : Math.round(max)} <span className='ml-[1px]'>{suffix}</span></span>
      </div>
    </div>
  );
};

export default Input;
