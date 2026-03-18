import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full h-full min-h-[75vh] flex items-center justify-center relative">
      <div className="relative w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none select-none mix-blend-multiply">
        <Image
          src="/images/logo.svg"
          alt="CBF Pharma Logo"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 256px, 384px"
        />
      </div>
    </div>
  );
}
