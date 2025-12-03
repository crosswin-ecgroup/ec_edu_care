import { useGetTeacherByIdQuery } from '@/services/teachers.api';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TeacherDetails() {
    const { id: classId, teacherId } = useLocalSearchParams<{ id: string; teacherId: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: teacher, isLoading } = useGetTeacherByIdQuery(teacherId || '');

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!teacher) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Teacher not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                className="bg-white dark:bg-gray-800 pb-6 rounded-b-[32px] shadow-sm z-10"
                style={{ paddingTop: insets.top + 10 }}
            >
                <View className="px-6 flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Teacher Profile</Text>
                    <View className="w-10" />
                </View>

                <View className="items-center px-6">
                    <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mb-4 border-4 border-white dark:border-gray-700 shadow-sm">
                        <Text className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {teacher.fullName?.charAt(0) || 'T'}
                        </Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">
                        {teacher.fullName}
                    </Text>
                    <Text className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        {teacher.specialization || 'General Teacher'}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Contact Info */}
                <View className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Information</Text>

                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-4">
                            <Ionicons name="mail" size={20} color="#4B5563" />
                        </View>
                        <View>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">Email Address</Text>
                            <Text className="text-base font-medium text-gray-900 dark:text-gray-100">{teacher.email}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-4">
                            <Ionicons name="call" size={20} color="#4B5563" />
                        </View>
                        <View>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">Phone Number</Text>
                            <Text className="text-base font-medium text-gray-900 dark:text-gray-100">{teacher.phoneNumber || 'Not provided'}</Text>
                        </View>
                    </View>
                </View>

                {/* Performance Stats (Placeholder for now as API might not support it directly here) */}
                <View className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Performance Overview</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center flex-1 border-r border-gray-100 dark:border-gray-700">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                {teacher.classes?.length || 0}
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Classes</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                {teacher.subjects?.length || 0}
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Subjects</Text>
                        </View>
                    </View>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
