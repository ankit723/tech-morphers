'use client'

import {Button} from "@/components/ui/button"
import { useState } from "react";

export default function PaymentButton({invoiceNumber, amount, currency, receipt, name, email, phone}: {invoiceNumber: string, amount: number, currency: string, receipt: string, name: string, email: string, phone: string}) {
    const [isLoading, setIsLoading] = useState(false);
    console.log("invoice number", invoiceNumber)

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
                window.location.reload()
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
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className={`
            flex items-center justify-center gap-2
            px-6 py-3 text-white font-semibold rounded-xl
            bg-gradient-to-br from-green-600 to-green-700 
            hover:from-green-700 hover:to-green-800
            transition-all duration-200 ease-in-out
            disabled:opacity-60 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
          `}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c1.104 0 2-.672 2-1.5S13.104 5 12 5s-2 .672-2 1.5S10.896 8 12 8zM6 10v10h12V10H6zm0 0V8a6 6 0 0112 0v2"
                />
              </svg>
              <span>Pay {currency} {amount} Securely</span>
            </>
          )}
        </Button>

    )
}