import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AuthCard } from '../../components/AuthCard';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { CustomAlert } from '../../components/CustomAlert';
import { loginWithPassword } from '../../utils/oauth';
import { useAuthStore } from '../../store/auth.store';
import { useSendTelegramOtpMutation, useVerifyTelegramOtpMutation } from '../../services/auth.api';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'error' as 'error' | 'success' | 'info'
    });

    const setAuth = useAuthStore((state) => state.setAuth);
    const [sendOtp] = useSendTelegramOtpMutation();
    const [verifyOtp] = useVerifyTelegramOtpMutation();

    const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    const handlePasswordLogin = async () => {
        if (!username || !password) {
            showAlert('Error', 'Please enter username and password');
            return;
        }
        setIsLoading(true);
        try {
            const tokens = await loginWithPassword(username, password);
            setAuth(tokens.access_token, tokens.refresh_token, null);
        } catch (error: any) {
            showAlert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTelegramLogin = async () => {
        if (!phoneNumber) {
            showAlert('Error', 'Please enter your phone number');
            return;
        }
        setIsLoading(true);
        try {
            await sendOtp({ phoneNumber }).unwrap();
            setShowOtpInput(true);
            showAlert('Success', 'OTP sent to your Telegram', 'success');
        } catch (error: any) {
            showAlert('Error', 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            showAlert('Error', 'Please enter the OTP');
            return;
        }
        setIsLoading(true);
        try {
            const result = await verifyOtp({ phoneNumber, otp }).unwrap();
            setAuth(result.access_token, result.refresh_token, result.user);
        } catch (error: any) {
            showAlert('Error', 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 bg-gray-50 dark:bg-gray-900"
            keyboardVerticalOffset={0}
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="flex-grow items-center justify-center p-4"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {isLoading && <LoadingOverlay message="Authenticating..." />}

                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={hideAlert}
                />

                <View className="mb-8 items-center">
                    <Image
                        source={require('../../assets/images/logo.jpg')}
                        className="w-32 h-32 mb-4 rounded-full"
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-bold text-blue-800 dark:text-blue-400">EC Edu Care</Text>
                </View>

                <AuthCard title="Welcome Back">
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-900 dark:text-gray-100"
                        placeholder="Username"
                        placeholderTextColor="#9CA3AF"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 pr-3">
                        <TextInput
                            className="flex-1 p-3 text-gray-900 dark:text-gray-100"
                            placeholder="Password"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <PrimaryButton title="Login" onPress={handlePasswordLogin} />

                    <View className="my-6 flex-row items-center">
                        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                        <Text className="mx-4 text-gray-500 dark:text-gray-400">OR</Text>
                        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                    </View>

                    <Text className="text-center mb-4 text-gray-700 dark:text-gray-300 font-medium">Telegram Login</Text>

                    {!showOtpInput ? (
                        <>
                            <TextInput
                                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-900 dark:text-gray-100"
                                placeholder="Phone Number (e.g. +1234567890)"
                                placeholderTextColor="#9CA3AF"
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
                                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-900 dark:text-gray-100"
                                placeholder="Enter OTP"
                                placeholderTextColor="#9CA3AF"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                            />
                            <PrimaryButton title="Verify OTP" onPress={handleVerifyOtp} />
                            <Text
                                className="text-blue-600 dark:text-blue-400 text-center mt-4"
                                onPress={() => setShowOtpInput(false)}
                            >
                                Change Phone Number
                            </Text>
                        </>
                    )}
                </AuthCard>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
