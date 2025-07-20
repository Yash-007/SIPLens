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
  allowDecimal?: boolean;
  info?: string;
}

const Input = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  prefix, 
  suffix, 
  showCommas = false,
  allowDecimal = false,
  info
}: InputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string = e.target.value;
    
    if (allowDecimal) {
      // Allow numbers and single decimal point
      newValue = newValue.replace(/[^\d.]/g, '');
      
      // Ensure only one decimal point
      const decimalCount = (newValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        newValue = newValue.replace(/\./g, (match, index, original) => 
          index === original.indexOf('.') ? match : ''
        );
      }

      // Limit to one decimal place
      if (newValue.includes('.')) {
        const [whole, decimal] = newValue.split('.');
        newValue = `${whole}.${decimal.slice(0, 1)}`; // Keep exactly one decimal place
      }

      setInputValue(newValue);

      if (!newValue) {
        onChange(min);
        return;
      }

      let numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        // Use exact decimal value (e.g., 10.5 stays 10.5)
        if (numValue > max) {
          onChange(max);
        } else if (numValue < min) {
          onChange(min);
        } else {
          onChange(numValue); // Pass the exact decimal value for calculations
        }
      }
    } else {
      // Original behavior for non-decimal inputs
      const numericValue = newValue.replace(/,/g, '').replace(/[^0-9]/g, '');
      
      if (!numericValue) {
        setInputValue('');
        onChange(min);
        return;
      }

      const numValue = Number(numericValue);
      
      if (!isNaN(numValue)) {
        if (numValue > max) {
          setInputValue(max.toString());
          onChange(max);
        } else {
          setInputValue(numericValue);
          onChange(numValue < min ? min : numValue);
        }
      }
    }
  };

  const handleBlur = () => {
    if (allowDecimal) {
      const currentValue = parseFloat(inputValue);
      if (!isNaN(currentValue)) {
        const finalValue = Math.min(Math.max(currentValue, min), max);
        setInputValue(finalValue.toFixed(1));
        onChange(finalValue);
      } else {
        setInputValue(value.toFixed(1));
      }
    } else {
      const currentValue = Number(inputValue.replace(/,/g, ''));
      if (!isNaN(currentValue)) {
        if (currentValue > max) {
          setInputValue(formatValue(max).toString());
        } else {
          setInputValue(formatValue(value).toString());
        }
      }
    }
  };

  const formatValue = (val: number) => {
    if (allowDecimal) {
      return val.toFixed(1);
    }
    if (showCommas) {
      return Math.round(val).toLocaleString('en-IN');
    }
    return Math.round(val);
  };

  const isValueBelowMin = Number(inputValue.replace(/,/g, '')) < min;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700 min-w-[100px] sm:min-w-fit">
            {label}
          </label>
          {info && (
            <div className="group relative flex-shrink-0">
              <div className="cursor-help text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-center">
                {info}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {prefix && <span className="text-gray-500">{prefix}</span>}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full sm:w-28 px-3 py-2 text-right text-sm border rounded-lg focus:outline-none focus:ring-2 font-semibold transition-all duration-200
              ${isValueBelowMin 
                ? 'border-red-200 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 hover:border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
          />
          {suffix && <span className="text-gray-500 ml-1">{suffix}</span>}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={allowDecimal ? 0.1 : 1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-indigo-600
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-150
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-indigo-600
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:transition-all
                     [&::-moz-range-thumb]:duration-150
                     [&::-moz-range-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:shadow-md"
        />
        <div
          className="absolute h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-l-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>{showCommas ? Math.round(min).toLocaleString('en-IN') : formatValue(min)} <span className='ml-[1px]'>{suffix}</span></span>
        <span>{showCommas ? Math.round(max).toLocaleString('en-IN') : formatValue(max)} <span className='ml-[1px]'>{suffix}</span></span>
      </div>
    </div>
  );
};

export default Input;
