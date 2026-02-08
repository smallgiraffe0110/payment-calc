import { ProcessorFees, CalculatorInputs } from '@/types';

export const PROCESSORS: Record<string, ProcessorFees> = {
  toast: {
    name: 'Toast',
    cardPresentRate: 2.49,
    cardPresentFixed: 0.15,
    cardNotPresentRate: 3.50,
    cardNotPresentFixed: 0.15,
    monthlyFee: 0,
    setupCost: 13000,
    hardwareCost: 0,
    description: 'Industry leader with proprietary hardware',
  },
  square: {
    name: 'Square',
    cardPresentRate: 2.60,
    cardPresentFixed: 0.10,
    cardNotPresentRate: 3.50,
    cardNotPresentFixed: 0.15,
    monthlyFee: 0,
    setupCost: 0,
    hardwareCost: 800,
    description: 'Popular for small businesses',
  },
  clover: {
    name: 'Clover',
    cardPresentRate: 2.30,
    cardPresentFixed: 0.10,
    cardNotPresentRate: 3.50,
    cardNotPresentFixed: 0.10,
    monthlyFee: 14.95,
    setupCost: 1500,
    hardwareCost: 1200,
    description: 'Flexible POS solution',
  },
  yourPlatform: {
    name: 'Our Platform',
    cardPresentRate: 1.50,
    cardPresentFixed: 0.10,
    cardNotPresentRate: 2.20,
    cardNotPresentFixed: 0.10,
    monthlyFee: 99,
    setupCost: 0,
    hardwareCost: 0,
    description: 'Hardware-agnostic, lowest fees',
  },
  crypto: {
    name: 'Stablecoin Rails (Future)',
    cardPresentRate: 0.50,
    cardPresentFixed: 0.05,
    cardNotPresentRate: 0.50,
    cardNotPresentFixed: 0.05,
    monthlyFee: 99,
    setupCost: 0,
    hardwareCost: 0,
    description: 'Next-gen blockchain payments',
  },
};

export const PROCESSOR_COLORS: Record<string, string> = {
  toast: '#f97316',
  square: '#3b82f6',
  clover: '#22c55e',
  yourPlatform: '#8b5cf6',
  crypto: '#f59e0b',
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  monthlyVolume: 100000,
  avgTransactionSize: 45,
  locations: 1,
  currentProcessor: 'toast',
  cardPresentPercent: 80,
};

export const RESTAURANT_PRESETS: Record<string, { label: string; inputs: Partial<CalculatorInputs> }> = {
  quickService: {
    label: 'Quick Service',
    inputs: { monthlyVolume: 80000, avgTransactionSize: 15, locations: 1 },
  },
  casualDining: {
    label: 'Casual Dining',
    inputs: { monthlyVolume: 150000, avgTransactionSize: 45, locations: 1 },
  },
  fineDining: {
    label: 'Fine Dining',
    inputs: { monthlyVolume: 200000, avgTransactionSize: 120, locations: 1 },
  },
  chain: {
    label: 'Chain (10 locations)',
    inputs: { monthlyVolume: 100000, avgTransactionSize: 35, locations: 10 },
  },
};
