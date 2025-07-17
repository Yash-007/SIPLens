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

    // Calculate monthly compounding
    for (let i = 1; i <= months; i++) {
      futureValue = (futureValue + inputs.monthlyAmount) * (1 + monthlyRate);
      
      // Store yearly data for the chart
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

    // Calculate inflation-adjusted value
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -inputs.duration);
    const inflationAdjustedValue = futureValue * inflationFactor;

    // Calculate tax on gains
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">SIP Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
          
          <div className="space-y-4">
            <Input
              label="Monthly Investment (₹)"
              value={inputs.monthlyAmount}
              onChange={(value) => handleInputChange('monthlyAmount', value)}
              min={500}
              max={1000000}
            />
            
            <Input
              label="Investment Duration (Years)"
              value={inputs.duration}
              onChange={(value) => handleInputChange('duration', value)}
              min={1}
              max={40}
            />
            
            <Input
              label="Expected Return Rate (%)"
              value={inputs.returnRate}
              onChange={(value) => handleInputChange('returnRate', value)}
              min={1}
              max={30}
            />
            
            <Input
              label="Inflation Rate (%)"
              value={inputs.inflationRate}
              onChange={(value) => handleInputChange('inflationRate', value)}
              min={0}
              max={20}
            />
            
            <Input
              label="Tax Rate (%)"
              value={inputs.taxRate}
              onChange={(value) => handleInputChange('taxRate', value)}
              min={0}
              max={40}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Investment:</span>
              <span className="font-semibold">₹{results.totalInvestment.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expected Returns:</span>
              <span className="font-semibold">₹{results.totalReturns.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inflation Adjusted Returns:</span>
              <span className="font-semibold">₹{results.inflationAdjustedReturns.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Post-tax Returns:</span>
              <span className="font-semibold">₹{results.postTaxReturns.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Growth Projection</h2>
        <Chart data={results.yearlyData} />
      </div>
    </div>
  );
};

export default Calculator;

