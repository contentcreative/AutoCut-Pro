import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    
    // TODO: Implement Stripe webhook verification and processing
    console.log('Stripe webhook received:', body);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Only allow POST requests for webhooks
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
