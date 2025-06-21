import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const bankDetails = await prisma.bankDetails.findFirst({
    where: { isActive: true, isDefault: true }
  })
  return NextResponse.json(bankDetails)
}