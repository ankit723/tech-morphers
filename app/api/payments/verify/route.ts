//razorpay verify payment

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = await request.json();
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string).update(body).digest('hex');

    if(razorpay_signature === expectedSignature) {
        return NextResponse.json({ message: "Payment verified" });
    } else {
        return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }
}