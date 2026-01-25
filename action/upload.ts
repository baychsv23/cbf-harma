"use server";
import { logger } from "@/lib/logger";
import { translations } from "@/lib/translation";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

type UploadType = "PO" | "GR" | "PI" | "PV" | "IN" | "RC";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
// รายการ MIME types ที่อนุญาต
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveImagesToStorage(
  targetId: number,
  files: File[],
  tx: any,
  type: UploadType, // ระบุว่าเป็น GR หรือ EX
) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const savedFilesPath: string[] = [];

  try {
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();

      if (
        !ALLOWED_EXTENSIONS.includes(ext) ||
        !ALLOWED_MIME_TYPES.includes(file.type)
      ) {
        throw new Error(translations.error);
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ตั้งชื่อไฟล์ตามประเภท (เช่น gr-10... หรือ ex-10...)
      const prefix = type.toLowerCase();
      const fileName = `${prefix}-${targetId}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      // 1. เขียนไฟล์ลง Disk
      await writeFile(filePath, buffer);
      savedFilesPath.push(filePath);

      // 2. บันทึกข้อมูลลง DB ตามเงื่อนไขของ Table
      if (type === "PO") {
        await tx.purchaseOrderImage.create({
          data: {
            url: `/uploads/${fileName}`,
            purchaseOrderId: targetId,
          },
        });
      }
      else if (type === "GR") {
        await tx.goodsReceiptImage.create({
          data: {
            url: `/uploads/${fileName}`,
            goodReceiptId: targetId,
          },
        });
      }
      else if (type === "PI") {
        // ship online
        await tx.purchaseInvoiceImage.create({
          data: {
            url: `/uploads/${fileName}`,
            purchaseInvoiceId: targetId,
          },
        });
      }
      else if (type === "PV") {
        // ship online
        await tx.purchasePaymentImage.create({
          data: {
            url: `/uploads/${fileName}`,
            purchasePaymentId: targetId,
          },
        });
      }
      else if (type === "IN") {
        // ship online
        await tx.invoiceImage.create({
          data: {
            url: `/uploads/${fileName}`,
            invoiceId: targetId,
          },
        });
      }
      else if (type === "RC") {
        // ship online
        await tx.receiptImage.create({
          data: {
            url: `/uploads/${fileName}`,
            receiptId: targetId,
          },
        });
      }
    }
    return savedFilesPath;
  } catch (error) {
    // 🚩 Rollback ไฟล์: ถ้า DB พัง หรือเกิด Error ให้ลบไฟล์ที่เพิ่งเขียนออกให้หมด
    for (const filePath of savedFilesPath) {
      try {
        await unlink(filePath);
      } catch (e) {
        logger.error("Cleanup failed", e, { filePath });
      }
    }
    throw error; // โยน Error ต่อเพื่อให้ Prisma Rollback Transaction
  }
}
