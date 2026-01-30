import { RefreshCcw, Search } from "lucide-react";
import clsx from "clsx";
import { translations } from "@/lib/translation";

type FilterActionsProps = {
    onClear: () => void;
    onApply: () => void;
};

export const FilterActions = ({ onClear, onApply }: FilterActionsProps) => {
    return (
        <div className="flex gap-3 w-full md:w-auto">
            {/* Clear */}
            <button
                type="button"
                onClick={onClear}
                className={clsx(
                    "group flex-1 md:flex-none flex items-center justify-center gap-2",
                    "px-6 py-3 rounded-2xl font-semibold",
                    "bg-white border border-gray-200 text-gray-600",
                    "hover:bg-gray-50 hover:border-gray-300",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                    "transition-all",
                    "disabled:opacity-50 disabled:pointer-events-none",
                )}
            >
                <RefreshCcw
                    size={18}
                    className="transition-transform group-hover:-rotate-90"
                />
            </button>

            {/* Apply */}
            <button
                type="button"
                onClick={onApply}
                className={clsx(
                    "group flex-1 md:flex-none flex items-center justify-center gap-2",
                    "px-8 py-3 rounded-2xl font-semibold text-white",
                    "bg-primary-500 from-primary-900 to-black",
                    "hover:from-primary hover:to-gray-800",
                    "shadow-lg shadow-black/20",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
                    "transition-all",
                    "disabled:opacity-50 disabled:pointer-events-none",
                )}
            >
                <Search
                    size={18}
                    className="transition-transform group-hover:scale-110"
                />
            </button>
        </div>
    );
};