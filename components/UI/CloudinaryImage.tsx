"use client";

import Image, { ImageProps } from "next/image";
import cloudinaryLoader from "@/components/cloudinary-loader";

export default function CloudinaryImage(props: Omit<ImageProps, "loader">) {
  return <Image loader={cloudinaryLoader} {...props} />;
}
