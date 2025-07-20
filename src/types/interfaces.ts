export type InvestmentType = 'sip' | 'lumpsum';

export interface CalculatorInputs {
  investmentType: InvestmentType;
  monthlyAmount: number;
  lumpsumAmount: number;
  duration: number;
  returnRate: number;
  inflationRate: number;
  taxRate: number;
}

export interface CalculationResults {
  totalInvestment: number;
  totalReturns: number;
  inflationAdjustedReturns: number;
  postTaxReturns: number;
  yearlyData: YearlyData[];
}

export interface YearlyData {
  year: number;
  investment: number;
  totalValue: number;
  inflationAdjustedValue: number;
  postTaxValue: number;
}

export interface ResultCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}

export interface HeaderProps {
  setIsWhyModalOpen: (isOpen: boolean) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
} 