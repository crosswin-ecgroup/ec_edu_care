import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '../../components/PrimaryButton';
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
        <LinearGradient
            colors={['#4F46E5', '#3730A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
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

                    <View className="items-center mb-12">
                        <View className="bg-white/20 p-6 rounded-[32px] backdrop-blur-md border border-white/20 mb-6 shadow-xl">
                            <Ionicons name="school" size={64} color="white" />
                        </View>
                        <Text className="text-4xl font-bold text-white tracking-tight text-center">
                            Welcome Back
                        </Text>
                        <Text className="text-blue-200 text-lg mt-2 text-center">
                            Sign in to continue
                        </Text>
                    </View>

                    <View className="bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 shadow-2xl">
                        <View className="mb-4">
                            <Text className="text-blue-100 text-sm font-medium mb-2 ml-1">Username</Text>
                            <View className="bg-white/10 border border-white/20 rounded-2xl flex-row items-center px-4 h-14">
                                <Ionicons name="person-outline" size={20} color="#BFDBFE" />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-base font-medium"
                                    placeholder="Enter username"
                                    placeholderTextColor="rgba(219, 234, 254, 0.5)"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-blue-100 text-sm font-medium mb-2 ml-1">Password</Text>
                            <View className="bg-white/10 border border-white/20 rounded-2xl flex-row items-center px-4 h-14">
                                <Ionicons name="lock-closed-outline" size={20} color="#BFDBFE" />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-base font-medium"
                                    placeholder="Enter password"
                                    placeholderTextColor="rgba(219, 234, 254, 0.5)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#BFDBFE" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handlePasswordLogin}
                            className="bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:scale-[0.98] transition-all mb-6"
                        >
                            <Text className="text-blue-600 font-bold text-lg">Sign In</Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center mb-6">
                            <View className="flex-1 h-[1px] bg-white/20" />
                            <Text className="mx-4 text-blue-200 text-sm font-medium">OR</Text>
                            <View className="flex-1 h-[1px] bg-white/20" />
                        </View>

                        {!showOtpInput ? (
                            <View>
                                <Text className="text-blue-100 text-sm font-medium mb-2 ml-1">Phone Number</Text>
                                <View className="bg-white/10 border border-white/20 rounded-2xl flex-row items-center px-4 h-14 mb-4">
                                    <Ionicons name="call-outline" size={20} color="#BFDBFE" />
                                    <TextInput
                                        className="flex-1 ml-3 text-white text-base font-medium"
                                        placeholder="+1234567890"
                                        placeholderTextColor="rgba(219, 234, 254, 0.5)"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={handleTelegramLogin}
                                    className="bg-blue-500/20 border border-blue-400/30 h-14 rounded-2xl items-center justify-center active:scale-[0.98] transition-all"
                                >
                                    <View className="flex-row items-center">
                                        <Ionicons name="paper-plane-outline" size={20} color="white" />
                                        <Text className="text-white font-bold text-base ml-2">Send OTP via Telegram</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <Text className="text-blue-100 text-sm font-medium mb-2 ml-1">Enter OTP</Text>
                                <View className="bg-white/10 border border-white/20 rounded-2xl flex-row items-center px-4 h-14 mb-4">
                                    <Ionicons name="keypad-outline" size={20} color="#BFDBFE" />
                                    <TextInput
                                        className="flex-1 ml-3 text-white text-base font-medium"
                                        placeholder="123456"
                                        placeholderTextColor="rgba(219, 234, 254, 0.5)"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={handleVerifyOtp}
                                    className="bg-green-500 h-14 rounded-2xl items-center justify-center shadow-lg active:scale-[0.98] transition-all mb-4"
                                >
                                    <Text className="text-white font-bold text-lg">Verify & Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowOtpInput(false)}>
                                    <Text className="text-blue-200 text-center font-medium">Change Phone Number</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
