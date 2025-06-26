//razorpay webhook
export const config = {api: {bodyParser: false}};

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

function verifySignature(body: Buffer, signature: string, secret: string) {
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return expected === signature;
}

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') return NextResponse.json({error: "Method Not Allowed"}, {status: 405});
    
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const isValid = verifySignature(Buffer.from(rawBody), signature as string, secret);
    if (!isValid) return NextResponse.json({error: "Invalid Signature"}, {status: 400});

    const event = JSON.parse(rawBody);
    console.log(event);

    if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;
        const amount = payment.amount;
        const currency = payment.currency;
        const invoiceNumber = payment.notes.invoiceNumber;

        const project = await prisma.clientDocument.findFirst({
            where: {
                invoiceNumber: invoiceNumber,
            },
        });

        if (!project) return NextResponse.json({error: "Project not found"}, {status: 400});

        await prisma.clientDocument.update({
            where: {
                id: project.id,
            },
            data: {
                paymentStatus: "PAID",
                paymentMethod: "RAZORPAY",
                paidAt: new Date(),
                paymentProof: orderId,
                paymentVerified: true,
                transactionId: orderId,
                currency: currency,
            },
        });

        await prisma.paymentRecord.create({ 
            data: {
                documentId: project.id,
                clientId: project.clientId,
                amount: amount,
                currency: currency,
                paymentMethod: "RAZORPAY",
                transactionId: orderId,
                status: "PAID",
                verifiedBy: "RAZORPAY",
                verifiedAt: new Date(),
            },
        });

        return NextResponse.json({message: "Payment captured successfully"}, {status: 200});
    }

    return NextResponse.json({message: "Webhook received"}, {status: 200});
}