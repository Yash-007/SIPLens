import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Chart from '../components/Chart';

interface CalculatorInputs {
  monthlyAmount: number;
  duration: number;
  returnRate: number;
  inflationRate: number;
  taxRate: number;
}

interface CalculationResults {
  totalInvestment: number;
  totalReturns: number;
  inflationAdjustedReturns: number;
  postTaxReturns: number;
  yearlyData: {
    year: number;
    investment: number;
    totalValue: number;
    inflationAdjustedValue: number;
  }[];
}

const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyAmount: 5000,
    duration: 10,
    returnRate: 12,
    inflationRate: 6,
    taxRate: 30,
  });

  const [results, setResults] = useState<CalculationResults>({
    totalInvestment: 0,
    totalReturns: 0,
    inflationAdjustedReturns: 0,
    postTaxReturns: 0,
    yearlyData: [],
  });

  const calculateSIP = () => {
    const monthlyRate = inputs.returnRate / 12 / 100;
    const months = inputs.duration * 12;
    const yearlyData = [];
    
    let totalInvestment = inputs.monthlyAmount * months;
    let futureValue = 0;

    for (let i = 1; i <= months; i++) {
      futureValue = (futureValue + inputs.monthlyAmount) * (1 + monthlyRate);
      
      if (i % 12 === 0) {
        const year = i / 12;
        const investment = inputs.monthlyAmount * i;
        const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -year);
        
        yearlyData.push({
          year,
          investment,
          totalValue: futureValue,
          inflationAdjustedValue: futureValue * inflationFactor,
        });
      }
    }

    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -inputs.duration);
    const inflationAdjustedValue = futureValue * inflationFactor;

    const gains = futureValue - totalInvestment;
    const taxAmount = (gains * inputs.taxRate) / 100;
    const postTaxValue = futureValue - taxAmount;

    setResults({
      totalInvestment,
      totalReturns: futureValue,
      inflationAdjustedReturns: inflationAdjustedValue,
      postTaxReturns: postTaxValue,
      yearlyData,
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [inputs]);

  const handleInputChange = (name: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ResultCard = ({ title, value, subtitle, color }: { title: string; value: number; subtitle?: string; color: string }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <div className={`text-2xl font-bold mb-1 ${color}`}>
        ₹{Math.round(value).toLocaleString('en-IN')}
      </div>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SIP Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Plan your investment journey with our advanced SIP calculator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Investment Details
              </h2>
              
              <Input
                label="Monthly Investment"
                value={inputs.monthlyAmount}
                onChange={(value) => handleInputChange('monthlyAmount', value)}
                min={100}
                max={1000000}
                prefix="₹"
                showCommas={true}
              />
              
              <Input
                label="Investment Duration"
                value={inputs.duration}
                onChange={(value) => handleInputChange('duration', value)}
                min={1}
                max={40}
                suffix="Years"
              />
              
              <Input
                label="Expected Return Rate"
                value={inputs.returnRate}
                onChange={(value) => handleInputChange('returnRate', value)}
                min={1}
                max={30}
                suffix="%"
              />
              
              <Input
                label="Inflation Rate"
                value={inputs.inflationRate}
                onChange={(value) => handleInputChange('inflationRate', value)}
                min={0}
                max={20}
                suffix="%"
              />
              
              <Input
                label="Tax Rate"
                value={inputs.taxRate}
                onChange={(value) => handleInputChange('taxRate', value)}
                min={0}
                max={40}
                suffix="%"
              />
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <ResultCard
                title="Total Investment"
                value={results.totalInvestment}
                subtitle="Amount you invested"
                color="text-blue-600"
              />
              <ResultCard
                title="Expected Returns"
                value={results.totalReturns}
                subtitle="Before tax and inflation"
                color="text-green-600"
              />
              <ResultCard
                title="Post-tax Returns"
                value={results.postTaxReturns}
                subtitle="Final amount you'll get"
                color="text-purple-600"
              />
              <ResultCard
                title="Inflation Adjusted Returns"
                value={results.inflationAdjustedReturns}
                subtitle="Real value of money"
                color="text-yellow-600"
              />
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Growth Projection
              </h2>
              <Chart data={results.yearlyData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

