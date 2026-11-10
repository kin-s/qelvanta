import { InvoicesClient } from "@/components/invoices/invoices-client";
import { getDocuments } from "@/actions/invoices";

export default async function Page() {
  const data = await getDocuments();
  return (
    <InvoicesClient 
      initialInvoices={data.invoices || []} 
      initialQuotations={data.quotations || []} 
    />
  );
}