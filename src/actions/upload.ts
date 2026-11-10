"use server"

import { s3 } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getCurrentOrgId } from "@/lib/auth-utils"

export async function uploadImage(formData: FormData) {
  try {
    const orgId = await getCurrentOrgId()
    const file = formData.get("file") as File
    if (!file) return { error: "No file provided" }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${orgId}/${crypto.randomUUID()}-${file.name}`

    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }))

    // Return the public URL
    return { success: true, url: `${process.env.R2_PUBLIC_URL}/${fileName}` }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload image." }
  }
}