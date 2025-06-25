'use client'

import {Button} from "@/components/ui/button"
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentButton({invoiceNumber, amount, currency, receipt, name, email, phone}: {invoiceNumber: string, amount: number, currency: string, receipt: string, name: string, email: string, phone: string}) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async() => {
        setIsLoading(true);
        const res = await fetch("/api/payments", {
            method: "POST",
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                invoiceNumber: invoiceNumber,
                receipt: receipt,
            }),
        });
        const order = await res.json();
        console.log(order);
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            name: "Techmorphers",
            description: "Payment for project",
            image: "/logo.png",
            handler: async (response: any) => {
                const verifyResponse = await fetch("/api/payments/verify", {
                    method: "POST",
                    body: JSON.stringify(response),
                });
                const json = await verifyResponse.json();
                toast.success(json.message);
            },
            prefill: {
                name: name,
                email: email,
                phone: phone,
            },
            theme: {
                color: "#000000",
            }
        }
        new (window as any).Razorpay(options).open();
        setIsLoading(false);
    }

    return (
        <Button onClick={handlePayment} disabled={isLoading}>
            Pay {currency} {amount} Securely Using Razorpay
        </Button>
    )
}