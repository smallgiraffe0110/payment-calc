export interface ProcessorFees {
  name: string;
  cardPresentRate: number;
  cardPresentFixed: number;
  cardNotPresentRate: number;
  cardNotPresentFixed: number;
  monthlyFee: number;
  setupCost: number;
  hardwareCost: number;
  description: string;
}

export interface CalculatorInputs {
  monthlyVolume: number;
  avgTransactionSize: number;
  locations: number;
  currentProcessor: string;
  cardPresentPercent: number;
}

export interface CalculationResults {
  currentProcessor: ProcessorFees;
  currentMonthlyCost: number;
  currentAnnualCost: number;
  currentTotalFirstYearCost: number;

  yourPlatform: ProcessorFees;
  yourMonthlyCost: number;
  yourAnnualCost: number;
  yourTotalFirstYearCost: number;

  monthlySavings: number;
  annualSavings: number;
  firstYearSavings: number;
  fiveYearSavings: number;

  cryptoMonthlyCost: number;
  cryptoAnnualCost: number;
  cryptoAnnualSavings: number;

  transactionCount: number;
  breakdownData: CostBreakdown[];
  timelineData: TimelineData[];
}

export interface CostBreakdown {
  processor: string;
  processingFees: number;
  fixedFees: number;
  monthlyFee: number;
  setupCost: number;
  hardwareCost: number;
  total: number;
  color: string;
}

export interface TimelineData {
  year: number;
  currentCost: number;
  yourCost: number;
  cryptoCost: number;
  savings: number;
}

export interface TrackingEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp: string;
}
