import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme, setColorScheme } = useColorScheme();

    // Profile data
    const profileData = {
        email: user?.email || 'admin@ecgroup.com',
        phone: '044 2616 1764',
        address: 'H-41, 12th Main Road, Anna Nagar, Chennai, Tamil Nadu 600040',
        joinDate: 'September 1, 2023',
        adminId: 'ADM-2023-001',
        role: 'Administrator'
    };

    const renderInfoItem = (icon: keyof typeof Ionicons.glyphMap, label: string, value: string, color: string, bgColor: string) => (
        <View className="flex-row items-center mb-5">
            <View className={`w-12 h-12 ${bgColor} rounded-2xl items-center justify-center mr-4 shadow-sm`}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</Text>
                <Text className="text-base text-gray-900 dark:text-white font-semibold leading-tight">{value}</Text>
            </View>
        </View>
    );

    const ThemeOption = ({ mode, icon, label }: { mode: 'light' | 'dark' | 'system', icon: keyof typeof Ionicons.glyphMap, label: string }) => (
        <TouchableOpacity
            onPress={() => setColorScheme(mode)}
            className={`flex-1 items-center justify-center p-4 rounded-2xl border ${colorScheme === mode
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                } mx-1`}
        >
            <Ionicons
                name={icon}
                size={24}
                color={colorScheme === mode ? '#4F46E5' : '#9CA3AF'}
            />
            <Text className={`mt-2 text-xs font-bold ${colorScheme === mode ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: insets.top + 5, paddingBottom: 20 }}
                className="px-6 rounded-b-[32px] shadow-xl z-10"
            >
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md active:bg-white/30 transition-all"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white tracking-wide">Profile</Text>
                    <View className="w-10" />
                </View>

                <View className="items-center">
                    <View className="relative">
                        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-3 border-4 border-white/30 shadow-2xl">
                            <Image
                                source={require('../../assets/images/logo.jpg')}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="absolute bottom-3 right-0 bg-green-500 w-7 h-7 rounded-full border-4 border-[#3730A3] items-center justify-center">
                            <Ionicons name="pencil" size={12} color="white" />
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-white tracking-tight mb-1">{user?.name || 'Admin User'}</Text>
                    <View className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <Text className="text-blue-100 font-medium text-xs">{user?.role || 'Administrator'}</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                {/* Theme Selector */}
                <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</Text>
                    <View className="flex-row justify-between">
                        <ThemeOption mode="light" icon="sunny-outline" label="Light" />
                        <ThemeOption mode="dark" icon="moon-outline" label="Dark" />
                        <ThemeOption mode="system" icon="phone-portrait-outline" label="System" />
                    </View>
                </View>

                {/* Personal Info */}
                <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Information</Text>

                    {renderInfoItem('mail', 'Email Address', profileData.email, '#3B82F6', 'bg-blue-50 dark:bg-blue-900/20')}
                    {renderInfoItem('call', 'Phone Number', profileData.phone, '#10B981', 'bg-green-50 dark:bg-green-900/20')}
                    {renderInfoItem('location', 'Address', profileData.address, '#8B5CF6', 'bg-purple-50 dark:bg-purple-900/20')}
                </View>

                {/* Account Info */}
                <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Details</Text>

                    <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-50 dark:border-gray-700/50">
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">Admin ID</Text>
                        <Text className="text-gray-900 dark:text-white font-bold">{profileData.adminId}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-50 dark:border-gray-700/50">
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">Role</Text>
                        <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg">
                            <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">{profileData.role}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">Member Since</Text>
                        <Text className="text-gray-900 dark:text-white font-bold">{profileData.joinDate}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={clearAuth}
                    className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/50 flex-row items-center justify-center mb-8 active:scale-[0.98] transition-all"
                >
                    <Ionicons name="log-out" size={24} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 font-bold text-lg ml-2">Sign Out</Text>
                </TouchableOpacity>

                <View className="items-center pb-10">
                    <Text className="text-gray-400 dark:text-gray-600 text-xs font-medium">
                        Version 1.0.0 (Build 2024.1)
                    </Text>
                    <Text className="text-gray-400 dark:text-gray-600 text-sm mb-1 mt-1">
                        Made with ❤️ by EC Group Datasoft Private Limited
                    </Text>
                    <Text className="text-gray-400 dark:text-gray-600 text-xs">
                        Prompt Patrol
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
