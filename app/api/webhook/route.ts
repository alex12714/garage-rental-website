import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { retrieveSession } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (webhookSecret) {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For development, parse the body directly
      event = JSON.parse(body);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Send updated booking data to webhook
      try {
        await fetch(process.env.WEBHOOK_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id: session.id,
            customer_name: session.metadata?.customerName,
            customer_email: session.customer_email,
            start_time: session.metadata?.startTime,
            end_time: session.metadata?.endTime,
            total_price: (session.amount_total || 0) / 100,
            payment_status: 'succeeded',
            payment_intent: session.payment_intent,
            language: session.metadata?.language,
            updated_at: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Webhook notification error:', webhookError);
      }

      // TODO: Send confirmation email
      console.log('Payment successful for session:', session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook error' },
      { status: 400 }
    );
  }
}
