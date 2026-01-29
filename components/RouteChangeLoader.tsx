"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(12);

    const t1 = setTimeout(() => setProgress(50), 120);
    const t2 = setTimeout(() => setProgress(80), 240);
    const t3 = setTimeout(() => setProgress(100), 360);
    const t4 = setTimeout(() => setVisible(false), 520);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-[9999] h-[4px] w-full overflow-hidden">
      <div
        className="
          h-full
          transition-all
          duration-300
          ease-out
          bg-gradient-to-r
          from-primary-400 via-primary-500 to-primary-600
          shadow-[0_0_16px_rgba(21,79,48,0.9)]
        "
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}