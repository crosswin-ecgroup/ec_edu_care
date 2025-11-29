import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetStudentsQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    // Ensure we fetch students if not already in cache
    const { data: students, isLoading } = useGetStudentsQuery();

    const studentData = students?.find(s => s.studentId === id);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!studentData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
                <View className="flex-1 items-center justify-center">
                    <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Student not found</Text>
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
                <View className="bg-green-600 dark:bg-green-700 p-6 pb-20">
                    <TouchableOpacity onPress={() => router.push('/dashboard/directory')} className="mb-4">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                        <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mr-4">
                            <Text className="text-3xl font-bold text-white">
                                {studentData.fullName[0].toUpperCase()}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-3xl font-bold text-white mb-1">
                                {studentData.fullName}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="school" size={16} color="white" />
                                <Text className="text-green-100 ml-2">Student</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-4 -mt-12">
                    {/* Contact Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                                <Ionicons name="call" size={20} color="#10B981" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Contact Information</Text>
                        </View>

                        {studentData.mobileNumber && (
                            <View className="mb-4">
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mobile Number</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`tel:${studentData.mobileNumber}`)}
                                    className="flex-row items-center"
                                >
                                    <Ionicons name="call" size={16} color="#6B7280" />
                                    <Text className="text-green-600 dark:text-green-400 ml-2">
                                        {studentData.mobileNumber}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Academic Info Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                                <Ionicons name="information-circle" size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Academic Details</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student ID</Text>
                            <Text className="text-gray-800 dark:text-gray-100 font-mono">{studentData.studentId}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grade</Text>
                            <Text className="text-gray-800 dark:text-gray-100">{studentData.grade}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="calendar" size={16} color="#6B7280" />
                            <Text className="text-gray-800 dark:text-gray-100 ml-2">
                                {formatDate(studentData.createdOn)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
