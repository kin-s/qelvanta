"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { Product } from "@/types/inventory"

// Map Prisma product to our frontend Product type
function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    barcode: p.barcode || "",
    description: p.description || "",
    categoryId: p.categoryId || "",
    brand: p.brand || "",
    purchasePrice: p.purchasePrice,
    sellingPrice: p.sellingPrice,
    taxCategory: "standard", // Hardcoded for now
    stockQuantity: p.stockQuantity,
    reorderLevel: p.reorderLevel,
    unit: p.unit,
    warehouseId: "wh_main", // Hardcoded for now
    status: p.status as any,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export async function getProducts() {
  try {
    const orgId = await getCurrentOrgId()
    
    const products = await prisma.product.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" }
    })

    return { products: products.map(mapProduct) }
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return { error: "Failed to load inventory. Make sure you have completed onboarding." }
  }
}

export async function createProduct(data: Product) {
  try {
    const orgId = await getCurrentOrgId()

    const newProduct = await prisma.product.create({
      data: {
        organizationId: orgId,
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        description: data.description,
        brand: data.brand,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        stockQuantity: data.stockQuantity,
        reorderLevel: data.reorderLevel,
        unit: data.unit,
        status: data.status,
      }
    })

    revalidatePath("/inventory")
    return { success: true, product: mapProduct(newProduct) }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { error: "Failed to create product. Please try again." }
  }
}