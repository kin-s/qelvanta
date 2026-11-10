import { WarehousesClient } from "@/components/operations/warehouses-client";
import { getBranches, getWarehouses } from "@/actions/operations";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const warehousesData = await getWarehouses();
  const branchesData = await getBranches();

  return (
    <WarehousesClient 
      initialWarehouses={warehousesData.warehouses || []} 
      initialBranches={branchesData.branches || []}
    />
  );
}