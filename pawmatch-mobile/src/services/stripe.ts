import Constants from 'expo-constants';

const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  merchantIdentifier: 'merchant.com.pawmatch.app',
  urlScheme: 'pawmatch',
};

// Stripe integration ready for:
// - SEPA Direct Debit (EU standard)
// - Card payments
// - Deposit escrow
// - Refunds

export const createPaymentIntent = async (amountInCents: number, currency: string = 'eur') => {
  // This would call your Supabase Edge Function or backend API
  // Example structure:
  
  const response = await fetch('YOUR_BACKEND_URL/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInCents,
      currency,
    }),
  });

  return await response.json();
};

export const formatEUR = (cents: number): string => {
  return new Intl.NumberFormat('en-MT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};
