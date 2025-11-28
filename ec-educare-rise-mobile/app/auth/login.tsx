import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView } from 'react-native';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AuthCard } from '../../components/AuthCard';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import {
    IDENTITY_SERVER_URL,
    CLIENT_ID,
    SCOPES,
    exchangeCodeForToken,
    generateCodeVerifier,
    generateCodeChallenge
} from '../../utils/oauth';
import { useAuthStore } from '../../store/auth.store';
import { useSendTelegramOtpMutation, useVerifyTelegramOtpMutation } from '../../services/auth.api';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: `${IDENTITY_SERVER_URL}/connect/authorize`,
    tokenEndpoint: `${IDENTITY_SERVER_URL}/connect/token`,
    revocationEndpoint: `${IDENTITY_SERVER_URL}/connect/revocation`,
};

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const [sendOtp] = useSendTelegramOtpMutation();
    const [verifyOtp] = useVerifyTelegramOtpMutation();

    // PKCE Setup
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: CLIENT_ID,
            scopes: SCOPES.split(' '),
            redirectUri: makeRedirectUri({
                scheme: 'com.eceducare.app'
            }),
            responseType: ResponseType.Code,
            usePKCE: true,
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { code, codeVerifier } = response.params; // expo-auth-session handles verifier generation internally if usePKCE is true?
            // Wait, if usePKCE is true, expo-auth-session handles the challenge and verifier.
            // But we need to pass the verifier to the token exchange if we do it manually.
            // request.codeVerifier is available.

            handleCodeExchange(code, request?.codeVerifier);
        } else if (response?.type === 'error') {
            Alert.alert('Authentication Error', response.error?.message);
        }
    }, [response]);

    const handleCodeExchange = async (code: string, verifier?: string) => {
        if (!verifier) return;
        setIsLoading(true);
        try {
            const tokens = await exchangeCodeForToken(code, verifier);
            setAuth(tokens.access_token, tokens.refresh_token, null); // We can fetch user info later
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTelegramLogin = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }
        setIsLoading(true);
        try {
            await sendOtp({ phoneNumber }).unwrap();
            setShowOtpInput(true);
            Alert.alert('Success', 'OTP sent to your Telegram');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }
        setIsLoading(true);
        try {
            const result = await verifyOtp({ phoneNumber, otp }).unwrap();
            setAuth(result.access_token, result.refresh_token, result.user);
        } catch (error: any) {
            Alert.alert('Error', 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerClassName="flex-grow items-center justify-center bg-gray-50 p-4">
            {isLoading && <LoadingOverlay message="Authenticating..." />}

            <View className="mb-8 items-center">
                <Text className="text-3xl font-bold text-blue-800">EC EduCare</Text>
                <Text className="text-gray-600 mt-2">Rise Mobile App</Text>
            </View>

            <AuthCard title="Welcome Back">
                <PrimaryButton
                    title="Sign in with IdentityServer"
                    onPress={() => promptAsync()}
                    disabled={!request}
                />

                <View className="my-6 flex-row items-center">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-4 text-gray-500">OR</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                <Text className="text-center mb-4 text-gray-700 font-medium">Telegram Login</Text>

                {!showOtpInput ? (
                    <>
                        <TextInput
                            className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="Phone Number (e.g. +1234567890)"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                        />
                        <PrimaryButton title="Send OTP" onPress={handleTelegramLogin} />
                    </>
                ) : (
                    <>
                        <TextInput
                            className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="Enter OTP"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                        />
                        <PrimaryButton title="Verify OTP" onPress={handleVerifyOtp} />
                        <Text
                            className="text-blue-600 text-center mt-4"
                            onPress={() => setShowOtpInput(false)}
                        >
                            Change Phone Number
                        </Text>
                    </>
                )}
            </AuthCard>
        </ScrollView>
    );
}
