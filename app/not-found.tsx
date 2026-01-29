import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-primary-50 via-white to-secondary-50">
            {/* Background decoration */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-600/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary-400/40 blur-3xl" />

            <div className="relative z-10 max-w-lg w-full px-6">
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-xl p-10 text-center">
                    {/* 404 */}
                    <h1 className="text-[120px] leading-none font-extrabold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        404
                    </h1>

                    {/* Message */}
                    <p className="mt-4 text-lg text-gray-600">
                        Oops! The page you are looking for doesn’t exist.
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                        It might have been moved or deleted.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-white font-medium hover:bg-primary-700 transition"
                        >
                            <Home size={18} />
                            Go Home
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </div>
        </div>
    );
}
