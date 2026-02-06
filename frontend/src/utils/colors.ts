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
    DELETE: "text-red-400",
};

export function getMethodColor(method: string): string {
    return methodVariants[method.toUpperCase()] || "bg-gray-500/20 border border-gray-500";
}

export function getMethodTextColor(method: string): string {
    const variant = methodTextVariants[method.toUpperCase()];
    return variant ? variant : "text-gray-500";
}

const statusCodeVariants: Record<string, string> = {
    "2": "bg-green-600/20 border border-green-600",
    "3": "bg-yellow-500/20 border border-yellow-500",
    "4": "bg-orange-500/20 border border-orange-500",
    "5": "bg-red-600/20 border border-red-600",
};

const staTusCodeTextVariants: Record<string, string> = {
    "2": "text-green-500",
    "3": "text-yellow-500",
    "4": "text-orange-500",
    "5": "text-red-400",
};

export function getStatusCodeColor(statusCode: string): string {
    const prefix = statusCode.charAt(0);
    return statusCodeVariants[prefix] || "bg-gray-500/20 border border-gray-500";
}

export function getStatusCodeTextColor(statusCode: string): string {
    const prefix = statusCode.charAt(0);
    const variant = staTusCodeTextVariants[prefix];
    return variant ? variant : "text-gray-500";
}

export function getActionColor(action: ActionOrder): string {
    const index = ACTION_ORDER.indexOf(action);
    if (index === -1) {
        return "bg-gray-500/20 border border-gray-500";
    }

    const colors = [
        "bg-blue-600/20 border border-blue-600",
        "bg-green-600/20 border border-green-600",
        "bg-yellow-500/20 border border-yellow-500",
        "bg-orange-500/20 border border-orange-500",
        "bg-red-600/20 border border-red-600",
        "bg-purple-600/20 border border-purple-600",
        "bg-pink-600/20 border border-pink-600",
        "bg-teal-600/20 border border-teal-600",
        "bg-indigo-600/20 border border-indigo-600",
        "bg-cyan-600/20 border border-cyan-600",
        "bg-lime-600/20 border border-lime-600",
        "bg-amber-600/20 border border-amber-600",
        "bg-emerald-600/20 border border-emerald-600",
        "bg-fuchsia-600/20 border border-fuchsia-600",
    ];
    return colors[index % colors.length]; // Cycle through colors if more actions than colors
}

export function getActionTextColor(action: ActionOrder): string {
    const index = ACTION_ORDER.indexOf(action);
    if (index === -1) {
        return "text-gray-500";
    }
    const textColors = [
        "text-blue-500",
        "text-green-500",
        "text-yellow-500",
        "text-orange-500",
        "text-red-400",
        "text-purple-500",
        "text-pink-500",
        "text-teal-500",
        "text-indigo-500",
        "text-cyan-500",
        "text-lime-500",
        "text-amber-500",
        "text-emerald-500",
        "text-fuchsia-500",
    ];
    return textColors[index % textColors.length];
}
