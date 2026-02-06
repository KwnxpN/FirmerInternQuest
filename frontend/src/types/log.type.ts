import type { User } from "./user.type.ts";
import type { ActionOrder } from "@/constants/actions";

export interface Log {
    _id: string;
    labnumber: string[];
    timestamp: string;
    request: {
        method: string;
        endpoint: string;
    };
    response: {
        statusCode: string;
        message: string;
        timeMs: number;
    };
    action: ActionOrder;
    user: User;
}

export interface LogQueryParams {
  action?: string[];
  startDate?: string;
  endDate?: string;
  userId?: string[];
  statusCode?: string;
  minResponseTime?: number;
  maxResponseTime?: number;
  labNumber?: string;
  page?: number;
  limit?: number;
  sortBy?: "timestamp" | "timeMs" | "action";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface LogResponse {
    success: boolean;
    count: number;
    totalCount: number;
    data: Log[];
    pagination: Pagination;
}