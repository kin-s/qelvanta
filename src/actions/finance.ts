"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import type { Expense, Income } from "@/types/finance"

export async function getFinanceData() {
  try {
    const orgId = await getCurrentOrgId()

    const expenses = await prisma.expense.findMany({
      where: { organizationId: orgId },
      orderBy: { date: "desc" }
    })

    const income = await prisma.income.findMany({
      where: { organizationId: orgId },
      orderBy: { date: "desc" }
    })

    // Map to frontend types
    const mappedExpenses: Expense[] = expenses.map(e => ({
      id: e.id, title: e.title, category: e.category as any, description: "",
      amount: e.amount, currency: "USD", date: e.date.toISOString(),
      paymentMethod: e.paymentMethod as any, supplier: "", branch: "Main",
      status: e.status as any, createdAt: e.createdAt.toISOString(),
    }))

    const mappedIncome: Income[] = income.map(i => ({
      id: i.id, title: i.title, category: i.category as any, description: "",
      amount: i.amount, currency: "USD", date: i.date.toISOString(),
      paymentMethod: i.paymentMethod as any, source: "", reference: "",
      createdAt: i.createdAt.toISOString(),
    }))

    return { expenses: mappedExpenses, income: mappedIncome }
  } catch (error) {
    console.error("Failed to fetch finance data:", error)
    return { error: "Failed to load finance data." }
  }
}

export async function createExpense(data: Expense) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.expense.create({
      data: {
        organizationId: orgId,
        title: data.title,
        category: data.category,
        amount: data.amount,
        date: new Date(data.date),
        paymentMethod: data.paymentMethod,
        status: data.status,
      }
    })
    revalidatePath("/finance")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save expense." }
  }
}

export async function createIncome(data: Income) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.income.create({
      data: {
        organizationId: orgId,
        title: data.title,
        category: data.category,
        amount: data.amount,
        date: new Date(data.date),
        paymentMethod: data.paymentMethod,
      }
    })
    revalidatePath("/finance")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save income." }
  }
}