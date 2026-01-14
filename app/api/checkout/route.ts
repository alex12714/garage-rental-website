import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      startTime,
      endTime,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      amount,
      language,
    } = body;

    // Validate required fields
    if (!startTime || !endTime || !customerName || !customerEmail || !customerPhone || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      amount,
      customerEmail,
      customerName,
      startTime,
      endTime,
      language: language || 'en',
    });

    // Send booking data to webhook
    try {
      await fetch(process.env.WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: session.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          special_requests: specialRequests || '',
          start_time: startTime,
          end_time: endTime,
          duration_hours: (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60),
          total_price: amount,
          payment_status: 'pending',
          language,
          created_at: new Date().toISOString(),
          stripe_session_id: session.id,
        }),
      });
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      // Continue even if webhook fails
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
