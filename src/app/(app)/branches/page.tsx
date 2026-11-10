import { BranchesClient } from "@/components/operations/branches-client";
import { getBranches, getWarehouses } from "@/actions/operations";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const branchesData = await getBranches();
  const warehousesData = await getWarehouses();

  return (
    <BranchesClient 
      initialBranches={branchesData.branches || []} 
      initialWarehouses={warehousesData.warehouses || []}
    />
  );
}