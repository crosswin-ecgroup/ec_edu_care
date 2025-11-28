import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetClassByIdQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';

export default function ClassDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: classData, isLoading } = useGetClassByIdQuery(id || '');

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!classData) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Text className="text-gray-500 dark:text-gray-400">Class not found</Text>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeSpan: any) => {
        if (!timeSpan) return 'N/A';
        const hours = Math.floor(timeSpan.totalHours || 0);
        const minutes = Math.floor((timeSpan.totalMinutes || 0) % 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
            <View className="p-4">
                {/* Header */}
                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {classData.name}
                    </Text>
                    <Text className="text-lg text-gray-600 dark:text-gray-400 mb-1">
                        {classData.subject}
                    </Text>
                    {classData.standard && (
                        <Text className="text-gray-500 dark:text-gray-500">
                            Standard: {classData.standard}
                        </Text>
                    )}
                </View>

                {/* Schedule Info */}
                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Schedule
                    </Text>

                    <View className="flex-row items-center mb-3">
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        <View className="ml-3 flex-1">
                            <Text className="text-sm text-gray-500 dark:text-gray-500">Start Date</Text>
                            <Text className="text-gray-800 dark:text-gray-100">{formatDate(classData.startDate)}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        <View className="ml-3 flex-1">
                            <Text className="text-sm text-gray-500 dark:text-gray-500">End Date</Text>
                            <Text className="text-gray-800 dark:text-gray-100">{formatDate(classData.endDate)}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <View className="ml-3 flex-1">
                            <Text className="text-sm text-gray-500 dark:text-gray-500">Session Duration</Text>
                            <Text className="text-gray-800 dark:text-gray-100">{formatTime(classData.sessionTime)}</Text>
                        </View>
                    </View>

                    {classData.dayOfWeek && classData.dayOfWeek.length > 0 && (
                        <View className="flex-row items-start">
                            <Ionicons name="repeat-outline" size={20} color="#6B7280" />
                            <View className="ml-3 flex-1">
                                <Text className="text-sm text-gray-500 dark:text-gray-500">Days</Text>
                                <Text className="text-gray-800 dark:text-gray-100">
                                    {classData.dayOfWeek.join(', ')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Teachers */}
                {classData.teachers && classData.teachers.length > 0 && (
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Teachers
                        </Text>
                        {classData.teachers.map((teacher: any, index: number) => (
                            <View key={index} className="flex-row items-center mb-3">
                                <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center">
                                    <Ionicons name="person" size={20} color="#3B82F6" />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                                        {teacher.name || 'Teacher'}
                                    </Text>
                                    {teacher.email && (
                                        <Text className="text-sm text-gray-500 dark:text-gray-500">
                                            {teacher.email}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Students */}
                {classData.students && classData.students.length > 0 && (
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Students ({classData.students.length})
                        </Text>
                        {classData.students.slice(0, 5).map((student: any, index: number) => (
                            <View key={index} className="flex-row items-center mb-3">
                                <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 items-center justify-center">
                                    <Ionicons name="person" size={20} color="#10B981" />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                                        {student.name || 'Student'}
                                    </Text>
                                    {student.email && (
                                        <Text className="text-sm text-gray-500 dark:text-gray-500">
                                            {student.email}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                        {classData.students.length > 5 && (
                            <Text className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                +{classData.students.length - 5} more students
                            </Text>
                        )}
                    </View>
                )}

                {/* Telegram Group */}
                {classData.telegramGroupLink && (
                    <TouchableOpacity className="bg-blue-600 dark:bg-blue-500 p-4 rounded-xl shadow-sm mb-4 flex-row items-center justify-center">
                        <Ionicons name="paper-plane" size={20} color="white" />
                        <Text className="text-white font-bold ml-2">Join Telegram Group</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}
