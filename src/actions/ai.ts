"use server"

import { openai } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"

export async function chatWithAI(userQuery: string) {
  try {
    const orgId = await getCurrentOrgId()

    // 1. Fetch real context from DB
    const products = await prisma.product.findMany({
      where: { organizationId: orgId },
      select: { name: true, stockQuantity: true, sellingPrice: true },
      take: 20 // Limit context size
    })

    const sales = await prisma.sale.findMany({
      where: { organizationId: orgId },
      select: { total: true, saleDate: true },
      orderBy: { saleDate: "desc" },
      take: 10
    })

    const contextData = `
      You are the QELVANTA AI Assistant. 
      Here is the current state of the user's business:
      Products (Name, Stock, Price): ${JSON.stringify(products)}
      Recent Sales (Total, Date): ${JSON.stringify(sales)}
    `

    // 2. Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cheap
      messages: [
        { role: "system", content: contextData },
        { role: "user", content: userQuery }
      ],
      temperature: 0.7,
    })

    return { reply: response.choices[0].message.content }
  } catch (error) {
    console.error("AI Error:", error)
    return { error: "The AI assistant is currently unavailable." }
  }
}