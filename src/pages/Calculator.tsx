import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Chart from '../components/Chart';
import Modal from '../components/Modal';
import ResultCard from '../components/ResultCard';
import WhyContent from '../components/WhyContent';
import CreatorSection from '../components/CreatorSection';
import Header from '../components/Header';
import TabSelector from '../components/TabSelector';
import type { CalculatorInputs, CalculationResults, InvestmentType } from '../types/interfaces';
import { calculateSIP, DEFAULT_CALCULATOR_INPUTS } from '../utils/calculator';

const Calculator = () => {
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_CALCULATOR_INPUTS);
  const [results, setResults] = useState<CalculationResults>({
    totalInvestment: 0,
    totalReturns: 0,
    inflationAdjustedReturns: 0,
    postTaxReturns: 0,
    yearlyData: [],
  });

  useEffect(() => {
    const newResults = calculateSIP({
      ...inputs,
      // Set unused investment amount to 0 based on selected type
      monthlyAmount: inputs.investmentType === 'lumpsum' ? 0 : inputs.monthlyAmount,
      lumpsumAmount: inputs.investmentType === 'sip' ? 0 : inputs.lumpsumAmount,
    });
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (name: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvestmentTypeChange = (type: InvestmentType) => {
    setInputs(prev => ({
      ...prev,
      investmentType: type,
      // Always use default values when switching tabs
      monthlyAmount: type === 'sip' ? DEFAULT_CALCULATOR_INPUTS.monthlyAmount : 0,
      lumpsumAmount: type === 'lumpsum' ? DEFAULT_CALCULATOR_INPUTS.lumpsumAmount : 0,
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full h-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1400px] mx-auto h-full">
          <Header setIsWhyModalOpen={setIsWhyModalOpen} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-xl p-8 space-y-8 sticky top-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Investment Details</span>
                </h2>

                <TabSelector
                  selected={inputs.investmentType}
                  onChange={handleInvestmentTypeChange}
                />
              
                <div className="space-y-6">
                  {inputs.investmentType === 'sip' ? (
                    <Input
                      label="Monthly SIP"
                      value={inputs.monthlyAmount}
                      onChange={(value) => handleInputChange('monthlyAmount', value)}
                      min={500}
                      max={1000000}
                      prefix="₹"
                      showCommas={true}
                      info="Regular monthly investment amount"
                    />
                  ) : (
                    <Input
                      label="Total Investment"
                      value={inputs.lumpsumAmount}
                      onChange={(value) => handleInputChange('lumpsumAmount', value)}
                      min={1000}
                      max={10000000}
                      prefix="₹"
                      showCommas={true}
                      info="One-time investment amount"
                    />
                  )}
                  
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
                  info="Your total returns if the market performs as expected. This is before considering tax and inflation."
                />
                <ResultCard
                  title="Post-tax Returns"
                  value={results.postTaxReturns}
                  subtitle="Final amount you'll get"
                  color="text-blue-600"
                  info="The amount you'll actually get after paying taxes on your investment gains."
                />
                <ResultCard
                  title="Inflation Adjusted Returns"
                  value={results.inflationAdjustedReturns}
                  subtitle="Value of your returns in today's money"
                  color="text-amber-600"
                  info="What your money will be worth in today's terms. For example, ₹1 crore after 15 years might buy what ₹50 lakhs can buy today, due to rising prices."
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
              <CreatorSection />
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

