import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { name, email, phone, message } = await request.json()
  await prisma.talkToUs.create({
    data: { name, email, phone, message }
  })
  return NextResponse.json({ message: "TalkToUs form submitted" })
}