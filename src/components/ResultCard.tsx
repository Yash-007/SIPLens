interface ResultCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
  info?: string;
}

const ResultCard = ({ title, value, subtitle, color, info }: ResultCardProps) => (
  <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
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
    <div className={`text-2xl font-bold mb-2 ${color}`}>
      ₹{Math.round(value).toLocaleString('en-IN')}
    </div>
    {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
  </div>
);

export default ResultCard;