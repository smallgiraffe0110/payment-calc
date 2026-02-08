'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Utensils, Store, CreditCard, Percent } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CalculatorInputs } from '@/types';
import { PROCESSORS, RESTAURANT_PRESETS } from '@/lib/constants';

interface InputFormProps {
  inputs: CalculatorInputs;
  onInputChange: (inputs: CalculatorInputs) => void;
  onCalculate: () => void;
}

const processorOptions = Object.entries(PROCESSORS)
  .filter(([key]) => key !== 'yourPlatform' && key !== 'crypto')
  .map(([key, processor]) => ({
    value: key,
    label: processor.name,
  }));

export default function InputForm({ inputs, onInputChange, onCalculate }: InputFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateInput = (field: keyof CalculatorInputs, value: string | number) => {
    onInputChange({ ...inputs, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (inputs.monthlyVolume <= 0) newErrors.monthlyVolume = 'Must be greater than 0';
    if (inputs.avgTransactionSize <= 0) newErrors.avgTransactionSize = 'Must be greater than 0';
    if (inputs.locations <= 0) newErrors.locations = 'Must be at least 1';
    if (inputs.cardPresentPercent < 0 || inputs.cardPresentPercent > 100) {
      newErrors.cardPresentPercent = 'Must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate();
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = RESTAURANT_PRESETS[presetKey];
    if (preset) {
      onInputChange({ ...inputs, ...preset.inputs });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Calculator className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>
        </div>

        {/* Preset Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Quick fill by restaurant type:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(RESTAURANT_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => applyPreset(key)}
                className="text-xs"
              >
                <Utensils className="h-3 w-3 mr-1" />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Monthly Card Volume"
              prefix="$"
              type="number"
              value={inputs.monthlyVolume || ''}
              onChange={(e) => updateInput('monthlyVolume', Number(e.target.value))}
              placeholder="100,000"
              hint="Total monthly credit/debit card sales"
              error={errors.monthlyVolume}
              min={0}
              aria-label="Monthly card processing volume in dollars"
            />

            <Input
              label="Average Transaction Size"
              prefix="$"
              type="number"
              value={inputs.avgTransactionSize || ''}
              onChange={(e) => updateInput('avgTransactionSize', Number(e.target.value))}
              placeholder="45"
              hint="Average check amount paid by card"
              error={errors.avgTransactionSize}
              min={0}
              aria-label="Average transaction size in dollars"
            />

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Number of Locations"
                  type="number"
                  value={inputs.locations || ''}
                  onChange={(e) => updateInput('locations', Number(e.target.value))}
                  placeholder="1"
                  error={errors.locations}
                  min={1}
                  aria-label="Number of restaurant locations"
                />
              </div>
              <div className="pb-1">
                <Store className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Select
              label="Current Processor"
              options={processorOptions}
              value={inputs.currentProcessor}
              onChange={(e) => updateInput('currentProcessor', e.target.value)}
              aria-label="Select your current payment processor"
            />
          </div>

          <div>
            <Input
              label="Card-Present Transactions"
              suffix="%"
              type="number"
              value={inputs.cardPresentPercent || ''}
              onChange={(e) => updateInput('cardPresentPercent', Number(e.target.value))}
              placeholder="80"
              hint="Percentage of transactions done in-person (vs online/phone)"
              error={errors.cardPresentPercent}
              min={0}
              max={100}
              aria-label="Percentage of in-person card transactions"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-6">
            <CreditCard className="h-5 w-5 mr-2" />
            Calculate My Savings
          </Button>

          <p className="text-center text-xs text-gray-500">
            No signup required. See results instantly.
          </p>
        </form>
      </Card>
    </motion.div>
  );
}
