//razorpay webhook
export const config = {api: {bodyParser: false}};

import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";
import getRawBody from "raw-body";

function verifySignature(body: Buffer, signature: string, secret: string) {
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return expected === signature;
}

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== 'POST') return response.status(405).json({error: "Method Not Allowed"});
    
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const rawBody = await getRawBody(request);
    const signature = request.headers["x-razorpay-signature"];

    const isValid = verifySignature(rawBody, signature as string, secret);
    if (!isValid) return response.status(400).json({error: "Invalid Signature"});

    const event = JSON.parse(rawBody.toString());
    console.log(event);

    if (event.event === "payment.captured") {
        const payment = event.payload.payment;
        const orderId = payment.order_id;
        const amount = payment.amount;
        const currency = payment.currency;
        const receipt = payment.receipt;
        const invoiceNumber = payment.notes.invoiceNumber;

        const project = await prisma.clientDocument.findFirst({
            where: {
                invoiceNumber: invoiceNumber,
            },
        });

        if (!project) return response.status(400).json({error: "Project not found"});

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
    }

    return response.status(200).json({message: "Webhook received"});
}