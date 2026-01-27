export interface Article {
    id: string; // หรือ number ตาม database ของคุณ
    titleEN: string;
    titleLA: string;
    content?: string;
    image?: string; // ถ้ามี field รูปภาพ
    type: string;
    status: string;
    createdAt: string;
    products?: { id: string; nameEN: string; nameLA: string }[];
    createdBy?: { fullName: string };
}