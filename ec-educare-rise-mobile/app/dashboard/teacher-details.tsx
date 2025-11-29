import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetTeachersQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TeacherDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    // Ensure we fetch teachers if not already in cache (e.g. direct navigation or refresh)
    const { data: teachers, isLoading } = useGetTeachersQuery();

    const teacherData = teachers?.find(t => t.teacherId === id);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!teacherData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
                <View className="flex-1 items-center justify-center">
                    <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Teacher not found</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="bg-blue-600 dark:bg-blue-700 p-6 pb-20">
                    <TouchableOpacity onPress={() => router.push('/dashboard/directory')} className="mb-4">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                        <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mr-4">
                            <Text className="text-3xl font-bold text-white">
                                {teacherData.fullName[0].toUpperCase()}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-3xl font-bold text-white mb-1">
                                {teacherData.fullName}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="briefcase" size={16} color="white" />
                                <Text className="text-blue-100 ml-2">Teacher</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-4 -mt-12">
                    {/* Contact Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                                <Ionicons name="call" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Contact Information</Text>
                        </View>

                        {teacherData.email && (
                            <View className="mb-4">
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`mailto:${teacherData.email}`)}
                                    className="flex-row items-center"
                                >
                                    <Ionicons name="mail" size={16} color="#6B7280" />
                                    <Text className="text-blue-600 dark:text-blue-400 ml-2">{teacherData.email}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {teacherData.mobileNumber && (
                            <View className="mb-4">
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mobile Number</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`tel:${teacherData.mobileNumber}`)}
                                    className="flex-row items-center"
                                >
                                    <Ionicons name="call" size={16} color="#6B7280" />
                                    <Text className="text-blue-600 dark:text-blue-400 ml-2">{teacherData.mobileNumber}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {teacherData.telegramUserId && (
                            <View>
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Telegram</Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="paper-plane" size={16} color="#6B7280" />
                                    <Text className="text-gray-800 dark:text-gray-100 ml-2">Connected</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Account Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                                <Ionicons name="information-circle" size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Account Details</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teacher ID</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-mono">{teacherData.teacherId}</Text>
                        </View>

                        <View>
                            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joined On</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar" size={16} color="#6B7280" />
                                <Text className="text-gray-800 dark:text-gray-100 ml-2">{formatDate(teacherData.createdOn)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mb-6">
                        {teacherData.email && (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`mailto:${teacherData.email}`)}
                                className="flex-1 bg-blue-600 p-4 rounded-xl mr-2 flex-row items-center justify-center"
                            >
                                <Ionicons name="mail" size={20} color="white" />
                                <Text className="text-white font-bold ml-2">Send Email</Text>
                            </TouchableOpacity>
                        )}
                        {teacherData.mobileNumber && (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${teacherData.mobileNumber}`)}
                                className="flex-1 bg-green-600 p-4 rounded-xl ml-2 flex-row items-center justify-center"
                            >
                                <Ionicons name="call" size={20} color="white" />
                                <Text className="text-white font-bold ml-2">Call</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
