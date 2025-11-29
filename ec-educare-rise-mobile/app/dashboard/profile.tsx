import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();

    // Mock data since API is missing
    const profileData = {
        email: user?.email || 'admin@ecgroup.com',
        phone: '+1 234 567 8900',
        address: '123 Education Lane, Learning City, 10001',
        joinDate: 'September 1, 2023',
        adminId: 'ADM-2023-001',
        role: 'Administrator'
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
            <ScrollView className="flex-1">
                <View className="bg-blue-600 dark:bg-blue-800 pb-20 pt-10 px-4 rounded-b-3xl">
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-white/20 p-2 rounded-full">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-white">My Profile</Text>
                    </View>

                    <View className="items-center">
                        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 border-4 border-blue-400">
                            <Ionicons name="person" size={48} color="#3B82F6" />
                        </View>
                        <Text className="text-2xl font-bold text-white">{user?.name || 'Admin'}</Text>
                        <Text className="text-blue-200 font-medium">{user?.role || 'Administrator'}</Text>
                    </View>
                </View>

                <View className="px-4 -mt-12">
                    <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                            Personal Information
                        </Text>

                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center mr-4">
                                <Ionicons name="mail-outline" size={20} color="#3B82F6" />
                            </View>
                            <View>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">Email</Text>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.email}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full items-center justify-center mr-4">
                                <Ionicons name="call-outline" size={20} color="#10B981" />
                            </View>
                            <View>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">Phone</Text>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.phone}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full items-center justify-center mr-4">
                                <Ionicons name="location-outline" size={20} color="#8B5CF6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm text-gray-500 dark:text-gray-400">Address</Text>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.address}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                            Account Details
                        </Text>

                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-500 dark:text-gray-400">Admin ID</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.adminId}</Text>
                        </View>

                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-500 dark:text-gray-400">Role</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.role}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-500 dark:text-gray-400">Joined Date</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.joinDate}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={clearAuth}
                        className="bg-red-600 dark:bg-red-700 p-4 rounded-xl shadow-sm flex-row items-center justify-center mb-6"
                    >
                        <Ionicons name="log-out-outline" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">Logout</Text>
                    </TouchableOpacity>

                    <View className="items-center pb-6">
                        <Text className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                            v1.0.0 (Build 1)
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-sm mb-1">
                            Made with ❤️ by EC EduCare Team
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-xs">
                            Prompt Patrol
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
