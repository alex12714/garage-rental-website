import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession({
  amount,
  customerEmail,
  customerName,
  startTime,
  endTime,
  language,
}: {
  amount: number;
  customerEmail: string;
  customerName: string;
  startTime: string;
  endTime: string;
  language: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Garage Rental',
            description: `Booking from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    customer_email: customerEmail,
    metadata: {
      customerName,
      startTime,
      endTime,
      language,
    },
  });

  return session;
}

export async function retrieveSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

export default stripe;
