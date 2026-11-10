import { InventoryClient } from "@/components/inventory/inventory-client";
import { getProducts } from "@/actions/inventory";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getProducts();

  if (data.error) {
    return (
      <div className="p-8 text-center text-danger">
        <p>{data.error}</p>
      </div>
    );
  }

  return <InventoryClient initialProducts={data.products || []} />;
}