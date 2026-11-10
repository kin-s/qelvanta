import { FinanceClient } from "@/components/finance/finance-client";
import { getFinanceData } from "@/actions/finance";

export default async function Page() {
  const data = await getFinanceData();
  return (
    <FinanceClient 
      initialExpenses={data.expenses || []} 
      initialIncome={data.income || []} 
    />
  );
}