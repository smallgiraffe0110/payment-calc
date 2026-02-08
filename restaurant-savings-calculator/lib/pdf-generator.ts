import { CalculatorInputs, CalculationResults } from '@/types';
import { formatCurrency } from './calculations';

export async function generatePDF(
  inputs: CalculatorInputs,
  results: CalculationResults
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Savings Report', margin, 20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Restaurant Cost Calculator', margin, 30);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 37);

  y = 55;

  // Input Summary
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Restaurant Profile', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = [
    `Monthly Card Volume: ${formatCurrency(inputs.monthlyVolume)}`,
    `Average Transaction: ${formatCurrency(inputs.avgTransactionSize)}`,
    `Locations: ${inputs.locations}`,
    `Current Processor: ${results.currentProcessor.name}`,
    `Card-Present: ${inputs.cardPresentPercent}%`,
    `Monthly Transactions: ~${results.transactionCount.toLocaleString()}`,
  ];

  summaryLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });

  y += 6;

  // Savings Highlight
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');

  doc.setTextColor(22, 163, 74);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUR ANNUAL SAVINGS', margin + 5, y + 10);

  doc.setFontSize(28);
  doc.text(formatCurrency(results.annualSavings), margin + 5, y + 27);

  y += 45;

  // Cost Comparison Table
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Comparison', margin, y);
  y += 10;

  // Table header
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);

  const col1 = margin + 3;
  const col2 = margin + 55;
  const col3 = margin + 100;
  const col4 = margin + 140;

  doc.text('Category', col1, y + 5.5);
  doc.text(results.currentProcessor.name, col2, y + 5.5);
  doc.text('Our Platform', col3, y + 5.5);
  doc.text('You Save', col4, y + 5.5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  const currentData = results.breakdownData[0];
  const platformData = results.breakdownData[1];

  const rows = [
    ['Processing Fees', currentData.processingFees, platformData.processingFees],
    ['Fixed Per-Txn Fees', currentData.fixedFees, platformData.fixedFees],
    ['Monthly Fee', currentData.monthlyFee, platformData.monthlyFee],
    ['Setup Cost', currentData.setupCost, platformData.setupCost],
    ['Hardware Cost', currentData.hardwareCost, platformData.hardwareCost],
  ] as const;

  rows.forEach(([label, current, ours]) => {
    doc.text(label, col1, y + 5);
    doc.text(formatCurrency(current), col2, y + 5);
    doc.text(formatCurrency(ours), col3, y + 5);
    const diff = current - ours;
    if (diff > 0) {
      doc.setTextColor(22, 163, 74);
      doc.text(formatCurrency(diff), col4, y + 5);
      doc.setTextColor(55, 65, 81);
    } else {
      doc.text('-', col4, y + 5);
    }
    doc.setDrawColor(243, 244, 246);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);
    y += 10;
  });

  // Totals
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly Total', col1, y + 7);
  doc.setTextColor(220, 38, 38);
  doc.text(formatCurrency(currentData.total), col2, y + 7);
  doc.setTextColor(139, 92, 246);
  doc.text(formatCurrency(platformData.total), col3, y + 7);
  doc.setTextColor(22, 163, 74);
  doc.text(formatCurrency(currentData.total - platformData.total), col4, y + 7);

  y += 20;

  // Summary stats
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Savings Summary', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const savingsSummary = [
    `Monthly Savings: ${formatCurrency(results.monthlySavings)}`,
    `Annual Savings: ${formatCurrency(results.annualSavings)}`,
    `First Year Savings: ${formatCurrency(results.firstYearSavings)}`,
    `5-Year Savings: ${formatCurrency(results.fiveYearSavings)}`,
    '',
    `With Stablecoin Rails (Coming 2026):`,
    `Annual Savings vs ${results.currentProcessor.name}: ${formatCurrency(results.cryptoAnnualSavings)}`,
  ];

  savingsSummary.forEach((line) => {
    if (line) {
      doc.text(line, margin, y);
    }
    y += 6;
  });

  y += 10;

  // CTA Footer
  doc.setFillColor(139, 92, 246);
  doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to start saving?', margin + 5, y + 10);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Schedule a demo today. Switch in 48 hours, not 4 weeks.', margin + 5, y + 18);

  // Footer
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text(
    'Generated by Restaurant Savings Calculator. Estimates based on provided inputs.',
    margin,
    doc.internal.pageSize.getHeight() - 10
  );

  return doc.output('blob');
}
