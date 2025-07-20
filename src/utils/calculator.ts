import type { CalculatorInputs, CalculationResults, YearlyData } from '../types/interfaces';

export const calculateSIP = (inputs: CalculatorInputs): CalculationResults => {
  const monthlyRate = inputs.returnRate / 12 / 100;
  const months = inputs.duration * 12;
  const yearlyData: YearlyData[] = [];
  
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

  return {
    totalInvestment,
    totalReturns: futureValue,
    inflationAdjustedReturns: inflationAdjustedValue,
    postTaxReturns: postTaxValue,
    yearlyData,
  };
};

export const formatCurrency = (value: number): string => {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
};

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  monthlyAmount: 5000,
  duration: 10,
  returnRate: 12,
  inflationRate: 5,
  taxRate: 12.5,
}; 