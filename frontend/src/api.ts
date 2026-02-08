import { useEffect, useState } from "react";
import axios from "axios";
import type { LogQueryParams, LogResponse } from "./types/log.type.ts";
import type { UserResponse } from "./types/user.type.ts";

import { buildUrlSearchParams, getInitialQueryParams } from "./lib/utils.ts";
import { useAuth } from "./hooks/useAuth.ts";

const API_BASE_URL = "http://localhost:5001/api";
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const useFetchLogs = () => {
    const [logs, setLogs] = useState<LogResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [queryParams, setQueryParams] = useState<LogQueryParams>(
        getInitialQueryParams(),
    );

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            setIsError(false);

            try {
                const searchParams = buildUrlSearchParams(queryParams);
                const response = await api.get<LogResponse>(`/logs?${searchParams.toString()}`);

                setLogs(response.data);
                localStorage.setItem("logsQueryParams", JSON.stringify(queryParams));

                console.log("Fetched logs:", response.data);
                console.log("Using query params:", queryParams);
            } catch (error) {
                setIsError(true);
                console.error("Error fetching logs:", error);
            }

            setIsLoading(false);
        };

        fetchLogs();
    }, [queryParams]);

    return { logs, isLoading, isError, queryParams, setQueryParams };
}

export const useFetchUsers = () => {
    const [users, setUsers] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            // Only admins can fetch the user list
            if (!user || user.level !== 'admin') {
                return;
            }
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await api.get<UserResponse>(`/users`);
                setUsers(response.data);
            } catch (error) {
                setIsError(true);
                console.error("Error fetching users:", error);
            }
            setIsLoading(false);
        };

        fetchUsers();
    }, []);

    return { users, isLoading, isError };
}