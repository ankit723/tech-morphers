import { NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/db"

export async function GET(request: NextRequest) {
    const bankDetails = await prisma.bankDetails.findFirst()
    return NextResponse.json(bankDetails)
}