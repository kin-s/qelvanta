"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import type { Sale, CartItem, PaymentMethod } from "@/types/sales"

export async function getSales() {
  try {
    const orgId = await getCurrentOrgId()
    const sales = await prisma.sale.findMany({
      where: { organizationId: orgId },
      include: {
        items: true,
        customer: true,
      },
      orderBy: { saleDate: "desc" }
    })

    // Map Prisma output to our frontend Sale type
    const mappedSales: Sale[] = sales.map(s => ({
      id: s.id,
      createdAt: s.saleDate.toISOString(),
      customerId: s.customerId || undefined,
      customerName: s.customer?.name || "Walk-in Customer",
      items: s.items.map(i => ({
        productId: i.productId,
        name: "Product", // We'd need to join products to get the name, simplified for now
        sku: "",
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
      subtotal: s.subtotal,
      discountPct: 0, // Simplified for this phase
      discountAmount: s.discountAmount,
      taxAmount: s.taxAmount,
      total: s.total,
      paymentMethod: s.paymentMethod as PaymentMethod,
      cashier: s.cashier || "System",
      status: s.status as any,
      refunds: [],
    }))

    return { sales: mappedSales }
  } catch (error) {
    console.error("Failed to fetch sales:", error)
    return { error: "Failed to load sales history." }
  }
}

export async function createSale(data: {
  cart: CartItem[];
  customerId?: string;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
}) {
  try {
    const orgId = await getCurrentOrgId()

    // Use a Prisma Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Sale
      const sale = await tx.sale.create({
        data: {
          organizationId: orgId,
          customerId: data.customerId,
          subtotal: data.cart.reduce((s, i) => s + (i.unitPrice * i.quantity), 0),
          discountAmount: data.discountAmount,
          taxAmount: data.taxAmount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          cashier: "Admin",
          status: "completed",
        }
      })

      // 2. Create Sale Items and Deduct Stock
      for (const item of data.cart) {
        // Create the item record
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.unitPrice * item.quantity,
          }
        })

        // Deduct inventory
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        })

        // Create a stock movement record
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "sold",
            quantity: -item.quantity,
            reference: sale.id,
            notes: "POS Sale",
          }
        })
      }

      return sale
    })

    revalidatePath("/sales")
    revalidatePath("/inventory")
    
    return { success: true, saleId: result.id }
  } catch (error) {
    console.error("Transaction failed:", error)
    return { error: "Failed to process sale. Stock may be insufficient." }
  }
}