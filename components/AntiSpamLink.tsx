"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";

interface AntiSpamLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function AntiSpamLink({
    href,
    children,
    className,
    onClick,
}: AntiSpamLinkProps) {
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (blocked) return;

        setBlocked(true);
        router.push(href);
        onClick?.();

        // Unblock after 200ms to prevent rapid clicks
        setTimeout(() => setBlocked(false), 200);
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
