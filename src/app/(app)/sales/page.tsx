import { SalesClient } from "@/components/sales/sales-client";
import { getProducts } from "@/actions/inventory";
import { getSales } from "@/actions/sales";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const productsData = await getProducts();
  const salesData = await getSales();

  return (
    <SalesClient 
      initialProducts={productsData.products || []} 
      initialSales={salesData.sales || []}
    />
  );
}