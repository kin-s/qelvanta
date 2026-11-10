"use server"

import { resend } from "@/lib/resend"

export async function sendInvoiceEmail(email: string, invoiceId: string, amount: number) {
  try {
    await resend.emails.send({
      from: 'QELVANTA <billing@yourdomain.com>', // Replace with your verified Resend domain
      to: email,
      subject: `Invoice ${invoiceId} from QELVANTA`,
      html: `<p>Hello,</p><p>Please find your invoice <strong>${invoiceId}</strong> for <strong>$${amount.toFixed(2)}</strong> attached to your account.</p><p>Thank you for your business!</p>`
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to send email." }
  }
}