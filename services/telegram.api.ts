import { api } from './api.base';

export interface TelegramAuthStatus {
    isAuthenticated: boolean;
    message: string;
    phoneNumber: string;
}

export const telegramApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTelegramAuthStatus: builder.query<TelegramAuthStatus, void>({
            query: () => '/telegramauth/status',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetTelegramAuthStatusQuery,
} = telegramApi;
