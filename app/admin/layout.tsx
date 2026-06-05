import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Admin — Buchungen',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
