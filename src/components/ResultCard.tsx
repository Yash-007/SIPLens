const ResultCard = ({ title, value, subtitle, color }: { title: string; value: number; subtitle?: string; color: string }) => (
    <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-gray-600 text-sm font-medium mb-3">{title}</h3>
      <div className={`text-2xl font-bold mb-2 ${color}`}>
        ₹{Math.round(value).toLocaleString('en-IN')}
      </div>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );

export default ResultCard