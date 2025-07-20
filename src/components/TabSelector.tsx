import type { InvestmentType } from '../types/interfaces';

interface TabSelectorProps {
  selected: InvestmentType;
  onChange: (type: InvestmentType) => void;
}

const TabSelector = ({ selected, onChange }: TabSelectorProps) => {
  return (
    <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl">
      <button
        className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200
          ${selected === 'sip'
            ? 'bg-white text-gray-800 shadow'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        onClick={() => onChange('sip')}
      >
        Monthly SIP
      </button>
      <button
        className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200
          ${selected === 'lumpsum'
            ? 'bg-white text-gray-800 shadow'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        onClick={() => onChange('lumpsum')}
      >
        One-time Investment
      </button>
    </div>
  );
};

export default TabSelector; 