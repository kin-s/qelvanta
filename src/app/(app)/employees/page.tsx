import { HrClient } from "@/components/hr/hr-client";
import { getEmployees } from "@/actions/hr";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getEmployees();
  return <HrClient initialEmployees={data.employees || []} />;
}