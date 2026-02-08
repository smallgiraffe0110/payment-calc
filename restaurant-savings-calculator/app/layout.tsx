import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant Savings Calculator | Stop Overpaying on Payment Processing',
  description:
    'See exactly how much your restaurant could save by switching payment processors. Compare Toast, Square, Clover costs with our platform. Free instant analysis.',
  keywords: 'restaurant payment processing, Toast alternatives, payment savings calculator, restaurant POS',
  openGraph: {
    title: 'Restaurant Savings Calculator',
    description: 'See how much your restaurant is losing on payment processing fees.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
