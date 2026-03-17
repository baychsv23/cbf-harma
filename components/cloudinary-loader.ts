export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // สร้าง URL ใหม่ที่สั่งให้ Cloudinary ทำการ resize ให้เลย
  const params = [`f_auto`, `c_limit`, `w_${width}`, `q_${quality || "auto"}`];
  return `https://res.cloudinary.com/dmdzx9fep/image/upload/${params.join(",")}/${src.split("/upload/")[1]}`;
}
