import type { CalculatorInputs, CalculationResults, YearlyData } from '../types/interfaces';

export const calculateSIP = (inputs: CalculatorInputs): CalculationResults => {
  const monthlyRate = inputs.returnRate / 12 / 100;
  const annualRate = inputs.returnRate / 100;
  const months = inputs.duration * 12;
  const yearlyData: YearlyData[] = [];
  
  // Calculate total investment
  const totalSIPInvestment = inputs.monthlyAmount * months;
  const totalInvestment = totalSIPInvestment + inputs.lumpsumAmount;

  // Calculate SIP future value
  // Formula: PMT * (((1 + r)^n - 1) / r) * (1 + r)
  // where PMT = monthly payment, r = monthly rate, n = number of months
  const sipFutureValue = inputs.monthlyAmount * 
    ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) / monthlyRate;

  // Calculate Lumpsum future value
  // Formula: P * (1 + r)^t
  // where P = principal, r = annual rate, t = time in years
  const lumpsumFutureValue = inputs.lumpsumAmount * Math.pow(1 + annualRate, inputs.duration);
  
  // Total future value is sum of both SIP and Lumpsum
  const futureValue = sipFutureValue + lumpsumFutureValue;

  // Calculate yearly data points
  for (let year = 1; year <= inputs.duration; year++) {
    const monthsCompleted = year * 12;
    
    // Calculate SIP value for this year
    const yearlyFutureValueSIP = inputs.monthlyAmount * 
      ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) * (1 + monthlyRate)) / monthlyRate;
    
    // Calculate Lumpsum value for this year
    const yearlyFutureValueLumpsum = inputs.lumpsumAmount * Math.pow(1 + annualRate, year);
    
    // Total value for this year
    const yearlyFutureValue = yearlyFutureValueSIP + yearlyFutureValueLumpsum;
    
    // Calculate investment amount for this year
    const yearlyInvestment = (inputs.monthlyAmount * monthsCompleted) + inputs.lumpsumAmount;
    
    // Calculate gains and tax
    const yearlyGains = yearlyFutureValue - yearlyInvestment;
    const yearlyTaxAmount = (yearlyGains * inputs.taxRate) / 100;
    const yearlyPostTaxValue = yearlyFutureValue - yearlyTaxAmount;
    
    // Calculate inflation adjustment
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, -year);
    const inflationAdjustedValue = yearlyPostTaxValue * inflationFactor;
    
    yearlyData.push({
      year,
      investment: yearlyInvestment,
      totalValue: yearlyFutureValue,
      postTaxValue: yearlyPostTaxValue,
      inflationAdjustedValue: inflationAdjustedValue,
    });
  }

  // Calculate final tax on total gains
  const totalGains = futureValue - totalInvestment;
  const totalTaxAmount = (totalGains * inputs.taxRate) / 100;
  const postTaxValue = futureValue - totalTaxAmount;

  // Calculate final inflation adjusted value
  const finalInflationFactor = Math.pow(1 + inputs.inflationRate / 100, -inputs.duration);
  const inflationAdjustedValue = postTaxValue * finalInflationFactor;

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
  investmentType: 'sip',
  monthlyAmount: 5000,
  lumpsumAmount: 100000,
  duration: 10,
  returnRate: 12,
  inflationRate: 5,
  taxRate: 12.5,
}; 