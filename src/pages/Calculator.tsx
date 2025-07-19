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
    <div className="space-y-4 text-gray-600">
      <section>
        <p className="text-lg leading-relaxed">
          SIPLens brings clarity and realism to your SIP investments. Most SIP calculators only show basic returns, don't consider inflation and tax, factors that can greatly impact actual gains. SIPLens gives you the complete picture.
        </p>
      </section>

      <div className="mt-6 p-4 bg-purple-50 rounded-xl">
        <p className="text-purple-800 font-medium">
          "The best investment you can make is in understanding your investments better."
        </p>
      </div>

      {/* Creator Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center space-y-3">
          <p className="flex items-center justify-center gap-2 text-gray-700 font-medium">
            Made with <span className="text-red-500 animate-pulse text-xl">❤️</span> by Yash Agrawal
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/Yash-007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/yash-agrawal-007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
              title="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/yash_agrawal007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
              title="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
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

          {/* Creator Section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center space-y-4">
              <p className="flex items-center justify-center gap-2 text-gray-700 font-medium">
                Made with <span className="text-red-500 animate-pulse text-xl">❤️</span> by Yash Agrawal
              </p>
              <div className="flex items-center justify-center gap-6">
                <a
                  href="https://github.com/Yash-007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/yash-agrawal-007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/yash_agrawal007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  title="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
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

