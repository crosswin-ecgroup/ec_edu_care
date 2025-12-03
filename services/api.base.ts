import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useAuthStore } from '../store/auth.store';
import { refreshAccessToken } from '../utils/oauth';

// Define the base URL
// In a real app, use env vars
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://localhost:5001/api';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = useAuthStore.getState().token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Logging middleware
const baseQueryWithLogging: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const startTime = Date.now();
    const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
    const url = typeof args === 'string' ? args : args.url;

    const result = await rawBaseQuery(args, api, extraOptions);

    const duration = Date.now() - startTime;

    if (result.error) {
        console.log(`🔴 API Error: ${method} ${url} - ${result.error.status} (${duration}ms)`);
        console.log('Error details:', result.error);
    } else {
        console.log(`🟢 API Success: ${method} ${url} - ${result.meta?.response?.status || 200} (${duration}ms)`);
    }

    return result;
};

// Re-authentication logic wrapping the logging middleware
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQueryWithLogging(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh the token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
            try {
                const refreshResult = await refreshAccessToken(refreshToken);
                if (refreshResult.access_token) {
                    // Store the new token
                    useAuthStore.getState().setAuth(
                        refreshResult.access_token,
                        refreshResult.refresh_token || refreshToken, // fallback to old refresh token if not rotated
                        useAuthStore.getState().user // keep existing user info
                    );

                    // Retry the original request
                    result = await baseQueryWithLogging(args, api, extraOptions);
                } else {
                    // Refresh failed
                    useAuthStore.getState().clearAuth();
                }
            } catch (refreshError) {
                // Refresh failed
                useAuthStore.getState().clearAuth();
            }
        } else {
            // No refresh token available
            useAuthStore.getState().clearAuth();
        }
    }
    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: ['Classes', 'Materials', 'Assignments', 'User', 'Teachers', 'Students', 'Sessions', 'Attendance', 'AcademicYear'],
});
