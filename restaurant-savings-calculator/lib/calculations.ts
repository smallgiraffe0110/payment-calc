import { CalculatorInputs, CalculationResults, CostBreakdown, TimelineData } from '@/types';
import { PROCESSORS, PROCESSOR_COLORS } from './constants';

export function calculateCosts(inputs: CalculatorInputs): CalculationResults {
  const { monthlyVolume, avgTransactionSize, locations, currentProcessor, cardPresentPercent } = inputs;

  const transactionCount = Math.round(monthlyVolume / avgTransactionSize);
  const cardPresentTxns = Math.round(transactionCount * (cardPresentPercent / 100));
  const cardNotPresentTxns = transactionCount - cardPresentTxns;

  const cardPresentVolume = monthlyVolume * (cardPresentPercent / 100);
  const cardNotPresentVolume = monthlyVolume - cardPresentVolume;

  const current = PROCESSORS[currentProcessor];
  const platform = PROCESSORS.yourPlatform;
  const crypto = PROCESSORS.crypto;

  // Current processor costs
  const currentProcessingRate =
    (cardPresentVolume * (current.cardPresentRate / 100)) +
    (cardNotPresentVolume * (current.cardNotPresentRate / 100));

  const currentFixedFees =
    (cardPresentTxns * current.cardPresentFixed) +
    (cardNotPresentTxns * current.cardNotPresentFixed);

  const currentMonthlyCost = currentProcessingRate + currentFixedFees + current.monthlyFee;
  const currentAnnualCost = currentMonthlyCost * 12;
  const currentTotalFirstYearCost = currentAnnualCost + current.setupCost + current.hardwareCost;

  // Our platform costs
  const platformProcessingRate =
    (cardPresentVolume * (platform.cardPresentRate / 100)) +
    (cardNotPresentVolume * (platform.cardNotPresentRate / 100));

  const platformFixedFees =
    (cardPresentTxns * platform.cardPresentFixed) +
    (cardNotPresentTxns * platform.cardNotPresentFixed);

  const yourMonthlyCost = platformProcessingRate + platformFixedFees + platform.monthlyFee;
  const yourAnnualCost = yourMonthlyCost * 12;
  const yourTotalFirstYearCost = yourAnnualCost + platform.setupCost + platform.hardwareCost;

  // Crypto costs
  const cryptoProcessingRate = monthlyVolume * (crypto.cardPresentRate / 100);
  const cryptoFixedFees = transactionCount * crypto.cardPresentFixed;
  const cryptoMonthlyCost = cryptoProcessingRate + cryptoFixedFees + crypto.monthlyFee;
  const cryptoAnnualCost = cryptoMonthlyCost * 12;

  // Savings (multiplied by locations)
  const monthlySavings = (currentMonthlyCost - yourMonthlyCost) * locations;
  const annualSavings = (currentAnnualCost - yourAnnualCost) * locations;
  const firstYearSavings = (currentTotalFirstYearCost - yourTotalFirstYearCost) * locations;
  const fiveYearSavings = (annualSavings * 5) + ((current.setupCost + current.hardwareCost) * locations);

  const cryptoAnnualSavings = (currentAnnualCost - cryptoAnnualCost) * locations;

  const breakdownData: CostBreakdown[] = [
    {
      processor: current.name,
      processingFees: currentProcessingRate,
      fixedFees: currentFixedFees,
      monthlyFee: current.monthlyFee,
      setupCost: current.setupCost,
      hardwareCost: current.hardwareCost,
      total: currentMonthlyCost,
      color: PROCESSOR_COLORS[currentProcessor] || '#6b7280',
    },
    {
      processor: platform.name,
      processingFees: platformProcessingRate,
      fixedFees: platformFixedFees,
      monthlyFee: platform.monthlyFee,
      setupCost: platform.setupCost,
      hardwareCost: platform.hardwareCost,
      total: yourMonthlyCost,
      color: PROCESSOR_COLORS.yourPlatform,
    },
    {
      processor: crypto.name,
      processingFees: cryptoProcessingRate,
      fixedFees: cryptoFixedFees,
      monthlyFee: crypto.monthlyFee,
      setupCost: crypto.setupCost,
      hardwareCost: crypto.hardwareCost,
      total: cryptoMonthlyCost,
      color: PROCESSOR_COLORS.crypto,
    },
  ];

  const timelineData: TimelineData[] = [];
  for (let year = 1; year <= 5; year++) {
    const currentCost = (currentAnnualCost * year) + current.setupCost + current.hardwareCost;
    const yourCost = (yourAnnualCost * year) + platform.setupCost + platform.hardwareCost;
    const cryptoCost = (cryptoAnnualCost * year) + crypto.setupCost + crypto.hardwareCost;

    timelineData.push({
      year,
      currentCost: currentCost * locations,
      yourCost: yourCost * locations,
      cryptoCost: cryptoCost * locations,
      savings: (currentCost - yourCost) * locations,
    });
  }

  return {
    currentProcessor: current,
    currentMonthlyCost,
    currentAnnualCost,
    currentTotalFirstYearCost,

    yourPlatform: platform,
    yourMonthlyCost,
    yourAnnualCost,
    yourTotalFirstYearCost,

    monthlySavings,
    annualSavings,
    firstYearSavings,
    fiveYearSavings,

    cryptoMonthlyCost,
    cryptoAnnualCost,
    cryptoAnnualSavings,

    transactionCount,
    breakdownData,
    timelineData,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
