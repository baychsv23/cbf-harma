export interface Article {
  id: string; // หรือ number ตาม database ของคุณ
  titleEN: string;
  titleLA: string;
  content?: string;
  coverImage?: string; // ถ้ามี field รูปภาพ
  type: string;
  slug: string;
  status: string;
  createdAt: string;
  products?: { id: string; nameEN: string; nameLA: string }[];
}
