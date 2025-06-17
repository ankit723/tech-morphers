import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  await prisma.letsTalk.create({
    data: { email }
  })
  return NextResponse.json({ message: "LetsTalk form submitted" })
}