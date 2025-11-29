import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    // Mock data since API is missing
    const profileData = {
        email: user?.email || 'student@example.com',
        phone: '+1 234 567 8900',
        address: '123 Education Lane, Learning City, 10001',
        joinDate: 'September 1, 2023',
        studentId: 'ST-2023-001',
        grade: '10th Grade'
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
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
                    <Text className="text-2xl font-bold text-white">{user?.name || 'Student Name'}</Text>
                    <Text className="text-blue-200 font-medium">{user?.role || 'Student'}</Text>
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
                        Academic Details
                    </Text>

                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-500 dark:text-gray-400">Student ID</Text>
                        <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.studentId}</Text>
                    </View>

                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-500 dark:text-gray-400">Current Grade</Text>
                        <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.grade}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500 dark:text-gray-400">Joined Date</Text>
                        <Text className="text-gray-800 dark:text-gray-100 font-medium">{profileData.joinDate}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
