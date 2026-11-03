import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { BackNavigator } from '@/components/BackNavigator';
import { FeedbackModal } from '@/components/FeedbackModal';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mehfil Restaurant | Iconic Hyderabadi Culinary Institution',
  description:
    'Experience authentic Hyderabadi Biryani, Kebabs, Nizami Mughlai specialties, dine-in luxury, online delivery, party catering, and table reservations across Hyderabad.',
  keywords: [
    'Mehfil Restaurant',
    'Mehfil Biryani Hyderabad',
    'Best Hyderabadi Biryani',
    'Narayanguda Mehfil',
    'Madhapur Mehfil',
    'Mughlai Food Hyderabad',
    'Online Biryani Delivery',
  ],
  authors: [{ name: 'Mehfil Restaurant' }],
  openGraph: {
    title: 'Mehfil Restaurant | Iconic Hyderabadi Culinary Institution',
    description:
      'Authentic Nizami Biryani & Royal Culinary Specialties in Hyderabad. Order online, reserve tables & book catering.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mehfil Restaurant',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} dark`}>
      <head>
        <JsonLdSchema />
      </head>
      <body className="bg-mehfil-burgundy-dark text-mehfil-parchment antialiased min-h-screen flex flex-col selection:bg-mehfil-saffron selection:text-mehfil-burgundy-dark overscroll-none touch-pan-y">
        <CartProvider>
          <BackNavigator />
          <FeedbackModal />
          <main className="flex-grow">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
