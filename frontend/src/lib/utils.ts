import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LogQueryParams } from "../types/log.type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildUrlSearchParams(params: LogQueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.action && params.action.length > 0) {
    params.action.forEach(action => searchParams.append("action", action));
  }

  if (params.startDate) {
    searchParams.append("startDate", params.startDate);
  }
  searchParams.append("startDate", "2014-02-02");

  if (params.endDate) {
    searchParams.append("endDate", params.endDate);
  }

  if (params.userId && params.userId.length > 0) {
    params.userId.forEach(id => searchParams.append("userId", id));
  }

  if (params.statusCode) {
    searchParams.append("statusCode", params.statusCode);
  }

  if (params.minResponseTime !== undefined) {
    searchParams.append("minResponseTime", params.minResponseTime.toString());
  }

  if (params.maxResponseTime !== undefined) {
    searchParams.append("maxResponseTime", params.maxResponseTime.toString());
  }

  if (params.labNumber) {
    searchParams.append("labNumber", params.labNumber);
  }

  if (params.page !== undefined) {
    searchParams.append("page", params.page.toString());
  }

  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }

  if (params.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }

  return searchParams;
}