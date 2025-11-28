import { api } from './api.base';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendTelegramOtp: builder.mutation<void, { phoneNumber: string }>({
            query: (body) => ({
                url: '/auth/telegram/send-otp',
                method: 'POST',
                body,
            }),
        }),
        verifyTelegramOtp: builder.mutation<{ access_token: string; refresh_token: string; user: any }, { phoneNumber: string; otp: string }>({
            query: (body) => ({
                url: '/auth/telegram/verify-otp',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useSendTelegramOtpMutation, useVerifyTelegramOtpMutation } = authApi;
