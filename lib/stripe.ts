import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const DEPOSIT_AMOUNT = 10; // Fixed deposit amount in EUR

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
  const startDate = new Date(startTime).toLocaleString();
  const endDate = new Date(endTime).toLocaleString();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Garage Rental - Reservation Deposit",
            description: `Deposit to reserve garage from ${startDate} to ${endDate}. Total rental: €${amount}. Remaining balance (€${amount - DEPOSIT_AMOUNT}) due before rental begins.`,
          },
          unit_amount: DEPOSIT_AMOUNT * 100, // Fixed €10 deposit in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    customer_email: customerEmail,
    metadata: {
      customerName,
      startTime,
      endTime,
      language,
      totalAmount: amount.toString(),
      depositAmount: DEPOSIT_AMOUNT.toString(),
      remainingBalance: (amount - DEPOSIT_AMOUNT).toString(),
    },
  });

  return session;
}

export async function retrieveSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

export { DEPOSIT_AMOUNT };
export default stripe;
