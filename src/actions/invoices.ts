"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import type { Invoice, Quotation, BusinessDocument } from "@/types/invoices"

export async function getDocuments() {
  try {
    const orgId = await getCurrentOrgId()

    const invoices = await prisma.invoice.findMany({
      where: { organizationId: orgId },
      include: { items: true, customer: true },
      orderBy: { issueDate: "desc" }
    })

    const quotations = await prisma.quotation.findMany({
      where: { organizationId: orgId },
      include: { items: true, customer: true },
      orderBy: { issueDate: "desc" }
    })

    const mappedInvoices: Invoice[] = invoices.map(inv => ({
      id: inv.invoiceNumber,
      type: "invoice",
      customerId: inv.customerId || "",
      customerName: inv.customer?.name || "Walk-in",
      customerEmail: inv.customer?.email || "",
      issueDate: inv.issueDate.toISOString(),
      dueDate: inv.dueDate.toISOString(),
      items: inv.items.map(i => ({ id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, amount: i.amount })),
      subtotal: inv.subtotal, taxRate: 0.1, taxAmount: inv.taxAmount,
      discountPct: 0, discountAmount: 0, total: inv.total,
      status: inv.status as any, notes: "", createdAt: inv.createdAt.toISOString(),
    }))

    const mappedQuotations: Quotation[] = quotations.map(q => ({
      id: q.quotationNumber,
      type: "quotation",
      customerId: q.customerId || "",
      customerName: q.customer?.name || "Walk-in",
      customerEmail: q.customer?.email || "",
      issueDate: q.issueDate.toISOString(),
      expiryDate: q.expiryDate.toISOString(),
      items: q.items.map(i => ({ id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, amount: i.amount })),
      subtotal: q.subtotal, taxRate: 0.1, taxAmount: q.taxAmount,
      discountPct: 0, discountAmount: 0, total: q.total,
      status: q.status as any, notes: "", createdAt: q.createdAt.toISOString(),
    }))

    return { invoices: mappedInvoices, quotations: mappedQuotations }
  } catch (error) {
    return { error: "Failed to load invoices." }
  }
}

export async function saveDocument(doc: BusinessDocument) {
  try {
    const orgId = await getCurrentOrgId()
    
    if (doc.type === "invoice") {
      await prisma.invoice.create({
        data: {
          organizationId: orgId,
          customerId: doc.customerId || null,
          invoiceNumber: doc.id,
          dueDate: new Date(doc.dueDate),
          status: doc.status,
          subtotal: doc.subtotal,
          taxAmount: doc.taxAmount,
          total: doc.total,
          items: {
            create: doc.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, amount: i.amount }))
          }
        }
      })
    } else {
      await prisma.quotation.create({
        data: {
          organizationId: orgId,
          customerId: doc.customerId || null,
          quotationNumber: doc.id,
          expiryDate: new Date(doc.expiryDate),
          status: doc.status,
          subtotal: doc.subtotal,
          taxAmount: doc.taxAmount,
          total: doc.total,
          items: {
            create: doc.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, amount: i.amount }))
          }
        }
      })
    }
    revalidatePath("/invoices")
    return { success: true }
  } catch (error) {
    return { error: "Failed to save document." }
  }
}