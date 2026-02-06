import { ACTION_ORDER, type ActionOrder } from "@/constants/actions";

const methodVariants: Record<string, string> = {
    GET: "bg-green-500/20 border border-green-500",
    POST: "bg-blue-500/20 border border-blue-500",
    PUT: "bg-yellow-500/20 border border-yellow-500",
    PATCH: "bg-orange-500/20 border border-orange-500",
    DELETE: "bg-red-500/20 border border-red-500",
};

const methodTextVariants: Record<string, string> = {
    GET: "text-green-500",
    POST: "text-blue-500",
    PUT: "text-yellow-500",
    PATCH: "text-orange-500",
    DELETE: "text-red-500",
};

export function getMethodColor(method: string): string {
    return methodVariants[method.toUpperCase()] || "bg-gray-500/20 border border-gray-500";
}

export function getMethodTextColor(method: string): string {
    const variant = methodTextVariants[method.toUpperCase()];
    return variant ? variant : "text-gray-500";
}

const statusCodeVariants: Record<string, string> = {
    "2": "bg-green-600/20 border border-green-600 text-green-500",
    "3": "bg-yellow-500/20 border border-yellow-500 text-yellow-500",
    "4": "bg-orange-500/20 border border-orange-500 text-orange-500",
    "5": "bg-red-600/20 border border-red-600 text-red-500",
};

export function getStatusCodeColor(statusCode: string): string {
    const prefix = statusCode.charAt(0);
    return statusCodeVariants[prefix] || "bg-gray-500/20 border border-gray-500 text-gray-500";
}

export function getActionColor(action: ActionOrder): string {
    const index = ACTION_ORDER.indexOf(action);
    if (index === -1) {
        return "bg-gray-500/20 border border-gray-500 text-gray-500";
    }

    const colors = [
        "bg-blue-600/20 border border-blue-600 text-blue-500",
        "bg-green-600/20 border border-green-600 text-green-500",
        "bg-yellow-500/20 border border-yellow-500 text-yellow-500",
        "bg-orange-500/20 border border-orange-500 text-orange-500",
        "bg-red-600/20 border border-red-600 text-red-500",
        "bg-purple-600/20 border border-purple-600 text-purple-500",
        "bg-pink-600/20 border border-pink-600 text-pink-500",
        "bg-teal-600/20 border border-teal-600 text-teal-500",
        "bg-indigo-600/20 border border-indigo-600 text-indigo-500",
        "bg-cyan-600/20 border border-cyan-600 text-cyan-500",
        "bg-lime-600/20 border border-lime-600 text-lime-500",
        "bg-amber-600/20 border border-amber-600 text-amber-500",
        "bg-emerald-600/20 border border-emerald-600 text-emerald-500",
        "bg-fuchsia-600/20 border border-fuchsia-600 text-fuchsia-500",
    ];
    return colors[index % colors.length]; // Cycle through colors if more actions than colors
}
