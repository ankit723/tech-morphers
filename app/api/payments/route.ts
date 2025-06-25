//razorpay integration

import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    const { amount, currency, receipt, invoiceNumber } = await request.json();

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: receipt,
        notes: {
            invoiceNumber: invoiceNumber,
        },
    }

    try {
        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}