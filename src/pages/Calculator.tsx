import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Chart from '../components/Chart';
import Modal from '../components/Modal';

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
    postTaxValue: number;
  }[];
}

const Calculator = () => {
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyAmount: 5000,
    duration: 10,
    returnRate: 12,
    inflationRate: 5,
    taxRate: 12.5,
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

    // Calculate future value using SIP formula
    const futureValue = (inputs.monthlyAmount * 
      ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) / monthlyRate);

    // Calculate yearly data points
    for (let year = 1; year <= inputs.duration; year++) {
      const monthsCompleted = year * 12;
      const yearlyFutureValue = (inputs.monthlyAmount * 
        ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) * (1 + monthlyRate)) / monthlyRate);
      
      const investment = inputs.monthlyAmount * monthsCompleted;
      const yearlyGains = yearlyFutureValue - investment;
      const yearlyTaxAmount = (yearlyGains * inputs.taxRate) / 100;
      const yearlyPostTaxValue = yearlyFutureValue - yearlyTaxAmount;
      const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -year);
      
      yearlyData.push({
        year,
        investment,
        totalValue: yearlyFutureValue,
        postTaxValue: yearlyPostTaxValue,
        inflationAdjustedValue: yearlyPostTaxValue * inflationFactor,
      });
    }

    // Calculate tax on gains
    const gains = futureValue - totalInvestment;
    const taxAmount = (gains * inputs.taxRate) / 100;
    const postTaxValue = futureValue - taxAmount;

    // Calculate inflation adjusted value on post-tax amount
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -inputs.duration);
    const inflationAdjustedValue = postTaxValue * inflationFactor;

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
    <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-gray-600 text-sm font-medium mb-3">{title}</h3>
      <div className={`text-2xl font-bold mb-2 ${color}`}>
        ₹{Math.round(value).toLocaleString('en-IN')}
      </div>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );

  const WhyContent = () => (
    <div className="space-y-6 text-gray-600">
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">Why We Built SIPLens 🎯</h3>
        <p>
        SIPLens brings clarity and realism to your SIP investments. Most SIP calculators only show basic returns, don't consider inflation and tax, factors that can greatly impact actual gains. SIPLens gives you the complete picture.        </p>
      </section>

      {/* <section className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">Key Features 🌟</h3>
        <ul className="space-y-3 pl-5">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1.5">•</span>
            <div>
              <span className="font-medium text-gray-800">Real Returns After Tax:</span>
              <span className="ml-1">See exactly how much you'll take home after accounting for capital gains tax</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1.5">•</span>
            <div>
              <span className="font-medium text-gray-800">Inflation-Adjusted Value:</span>
              <span className="ml-1">Understand the true purchasing power of your future wealth</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1.5">•</span>
            <div>
              <span className="font-medium text-gray-800">Visual Growth Tracking:</span>
              <span className="ml-1">Track your investment growth with our interactive chart</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1.5">•</span>
            <div>
              <span className="font-medium text-gray-800">Yearly Breakdown:</span>
              <span className="ml-1">Get detailed year-by-year analysis of your investment</span>
            </div>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">The Reality Lens 🔍</h3>
        <p>
          Investment returns often look impressive on paper, but what matters is the real value of your money. SIPLens helps you:
        </p>
        <ul className="space-y-2 pl-5">
          <li className="flex items-center gap-2">
            <span className="text-purple-600">•</span>
            <span>Account for the impact of inflation on your returns</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-600">•</span>
            <span>Calculate post-tax earnings accurately</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-600">•</span>
            <span>Make informed decisions based on realistic projections</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-600">•</span>
            <span>Plan your long-term financial goals better</span>
          </li>
        </ul>
      </section> */}

      <div className="mt-8 p-4 bg-purple-50 rounded-xl">
        <p className="text-purple-800 font-medium">
          "The best investment you can make is in understanding your investments better."
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full h-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1400px] mx-auto h-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              SIPLens
            </h1>
            <p className="text-2xl font-tagline text-gray-700 max-w-2xl mx-auto italic leading-relaxed mb-8">
              See your SIP through the lens of reality
            </p>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <button 
                onClick={() => setIsWhyModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-2xl group-hover:animate-bounce">❓</span>
                <span className="font-medium">Why SIPLens?</span>
              </button>
              
              <button 
                onClick={() => {
                  window.open('https://github.com/Yash-007/SIPly', '_blank');
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-2xl group-hover:animate-spin">⭐</span>
                <span className="font-medium">Star on GitHub</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-xl p-8 space-y-8 sticky top-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Investment Details</span>
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
                  suffix="Yr"
                />
                
                <Input
                  label="Expected Return Rate"
                  value={inputs.returnRate}
                  onChange={(value) => handleInputChange('returnRate', value)}
                  min={1}
                  max={30}
                  suffix="%"
                  info="The expected annual return on your investment. Historical equity market returns have been between 12-15% per annum."
                />

                <Input
                  label="Tax Rate"
                  value={inputs.taxRate}
                  onChange={(value) => handleInputChange('taxRate', value)}
                  min={0}
                  max={40}
                  suffix="%"
                  allowDecimal={true}
                  info="Capital gains tax rate applied to your investment returns. For long-term equity investments, the typical tax rate is 12.5%."
                />

                <Input
                  label="Inflation Rate"
                  value={inputs.inflationRate}
                  onChange={(value) => handleInputChange('inflationRate', value)}
                  min={0}
                  max={20}
                  suffix="%"
                  allowDecimal={true}
                  info="Annual inflation rate used to calculate the real value of your investment in today's money. Average inflation in India has been around 5%."
                />  
              </div>
            </div>
            
            {/* Results Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ResultCard
                  title="Total Investment"
                  value={results.totalInvestment}
                  subtitle="Amount you invested"
                  color="text-indigo-700"
                />
                <ResultCard
                  title="Expected Returns"
                  value={results.totalReturns}
                  subtitle="Before tax and inflation"
                  color="text-emerald-600"
                />
                <ResultCard
                  title="Post-tax Returns"
                  value={results.postTaxReturns}
                  subtitle="Final amount you'll get"
                  color="text-blue-600"
                />
                <ResultCard
                  title="Inflation Adjusted Returns"
                  value={results.inflationAdjustedReturns}
                  subtitle="Value of your returns in today's money."
                  color="text-amber-600"
                />
              </div>

              {/* Chart Section */}
              <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Growth Projection</span>
                </h2>
                <div className="h-[500px]">
                  <Chart data={results.yearlyData} />
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            isOpen={isWhyModalOpen}
            onClose={() => setIsWhyModalOpen(false)}
            title="Why Choose SIPLens?"
          >
            <WhyContent />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

