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
  const [showTooltip, setShowTooltip] = useState(false);

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {info && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-indigo-500 focus:outline-none transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute z-10 w-64 px-4 py-3 -mt-1 text-sm leading-tight text-white transform -translate-x-1/2 -translate-y-full bg-gray-900 rounded-xl shadow-xl left-1/2">
                  {info}
                  <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-[8px] border-8 border-transparent border-t-gray-900" />
                </div>
              )}
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
            className={`w-28 px-3 py-2 text-right text-sm border rounded-lg focus:outline-none focus:ring-2 font-semibold transition-all duration-200
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
