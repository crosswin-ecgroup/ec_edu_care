import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetTeachersQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Teacher not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1">
                {/* Gradient Header */}
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-20 px-6 rounded-b-[32px] shadow-lg"
                >
                    <TouchableOpacity onPress={() => router.push('/dashboard/directory')} className="mb-6 self-start bg-white/20 p-2 rounded-full">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                        <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mr-5 border-2 border-white/30">
                            <Text className="text-4xl font-bold text-white">
                                {teacherData.fullName[0].toUpperCase()}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-white mb-1">
                                {teacherData.fullName}
                            </Text>
                            <View className="flex-row items-center bg-white/20 self-start px-3 py-1 rounded-full">
                                <Ionicons name="briefcase" size={14} color="white" />
                                <Text className="text-white ml-2 text-sm font-medium">Teacher</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View className="px-6 -mt-12">
                    {/* Contact Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
                        <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-xl mr-3">
                                <Ionicons name="call" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Contact Information</Text>
                        </View>

                        {teacherData.email && (
                            <View className="mb-4">
                                <Text className="text-xs font-medium text-gray-400 uppercase mb-1">Email</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`mailto:${teacherData.email}`)}
                                    className="flex-row items-center"
                                >
                                    <Ionicons name="mail-outline" size={18} color="#4F46E5" />
                                    <Text className="text-gray-800 dark:text-gray-100 ml-2 text-base font-medium">{teacherData.email}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {teacherData.mobileNumber && (
                            <View className="mb-4">
                                <Text className="text-xs font-medium text-gray-400 uppercase mb-1">Mobile Number</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`tel:${teacherData.mobileNumber}`)}
                                    className="flex-row items-center"
                                >
                                    <Ionicons name="call-outline" size={18} color="#4F46E5" />
                                    <Text className="text-gray-800 dark:text-gray-100 ml-2 text-base font-medium">{teacherData.mobileNumber}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {teacherData.telegramUserId && (
                            <View>
                                <Text className="text-xs font-medium text-gray-400 uppercase mb-1">Telegram</Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="paper-plane-outline" size={18} color="#4F46E5" />
                                    <Text className="text-gray-800 dark:text-gray-100 ml-2 text-base font-medium">Connected</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Account Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                        <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-xl mr-3">
                                <Ionicons name="information-circle" size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Account Details</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-xs font-medium text-gray-400 uppercase mb-1">Teacher ID</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-sm">
                                {teacherData.teacherId}
                            </Text>
                        </View>

                        <View>
                            <Text className="text-xs font-medium text-gray-400 uppercase mb-1">Joined On</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                                <Text className="text-gray-800 dark:text-gray-100 ml-2 font-medium">{formatDate(teacherData.createdOn)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mb-8">
                        {teacherData.email && (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`mailto:${teacherData.email}`)}
                                className="flex-1 mr-2 active:opacity-90"
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    className="p-4 rounded-xl flex-row items-center justify-center shadow-md"
                                >
                                    <Ionicons name="mail" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2">Email</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        {teacherData.mobileNumber && (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${teacherData.mobileNumber}`)}
                                className="flex-1 ml-2 active:opacity-90"
                            >
                                <LinearGradient
                                    colors={['#10B981', '#059669']}
                                    className="p-4 rounded-xl flex-row items-center justify-center shadow-md"
                                >
                                    <Ionicons name="call" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2">Call</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
