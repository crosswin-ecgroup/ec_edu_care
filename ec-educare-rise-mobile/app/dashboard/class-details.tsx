import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetClassByIdQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ClassDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: classData, isLoading } = useGetClassByIdQuery(id || '');

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!classData) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Class not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeSpan: any) => {
        if (!timeSpan) return 'N/A';
        const hours = Math.floor(timeSpan.totalHours || 0);
        const minutes = Math.floor((timeSpan.totalMinutes || 0) % 60);
        return `${hours}h ${minutes}m`;
    };

    const teacherCount = classData.teachers?.length || 0;
    const studentCount = classData.students?.length || 0;

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
                    <TouchableOpacity onPress={() => router.back()} className="mb-6 self-start bg-white/20 p-2 rounded-full">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-white mb-2">
                        {classData.name}
                    </Text>
                    <Text className="text-xl text-blue-100 font-medium">
                        {classData.subject}
                    </Text>
                    {classData.standard && (
                        <View className="bg-white/20 px-3 py-1 rounded-full self-start mt-3 border border-white/30">
                            <Text className="text-white font-medium">{classData.standard}</Text>
                        </View>
                    )}
                </LinearGradient>

                <View className="px-6 -mt-12">
                    {/* Stats Cards */}
                    <View className="flex-row justify-between mb-6">
                        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex-1 mr-3 border border-gray-100 dark:border-gray-700">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">{teacherCount}</Text>
                                    <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-1">Teachers</Text>
                                </View>
                                <View className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
                                    <Ionicons name="people" size={24} color="#3B82F6" />
                                </View>
                            </View>
                        </View>
                        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex-1 ml-3 border border-gray-100 dark:border-gray-700">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">{studentCount}</Text>
                                    <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-1">Students</Text>
                                </View>
                                <View className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                                    <Ionicons name="school" size={24} color="#10B981" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Schedule Card */}
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                        <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-xl mr-3">
                                <Ionicons name="calendar" size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                Schedule
                            </Text>
                        </View>

                        <View>
                            <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <View className="w-24">
                                    <Text className="text-xs font-medium text-gray-400 uppercase">Start Date</Text>
                                </View>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatDate(classData.startDate)}</Text>
                            </View>

                            <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <View className="w-24">
                                    <Text className="text-xs font-medium text-gray-400 uppercase">End Date</Text>
                                </View>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatDate(classData.endDate)}</Text>
                            </View>

                            <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <View className="w-24">
                                    <Text className="text-xs font-medium text-gray-400 uppercase">Duration</Text>
                                </View>
                                <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatTime(classData.sessionTime)}</Text>
                            </View>

                            {classData.dayOfWeek && classData.dayOfWeek.length > 0 && (
                                <View className="flex-row items-start py-3">
                                    <View className="w-24 pt-1">
                                        <Text className="text-xs font-medium text-gray-400 uppercase">Days</Text>
                                    </View>
                                    <View className="flex-1 flex-row flex-wrap">
                                        {classData.dayOfWeek.map((day: string, index: number) => (
                                            <View key={index} className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg mr-2 mb-2 border border-blue-100 dark:border-blue-800">
                                                <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
                                                    {day.slice(0, 3)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Teachers */}
                    {classData.teachers && classData.teachers.length > 0 && (
                        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                            <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-xl mr-3">
                                    <Ionicons name="person" size={20} color="#3B82F6" />
                                </View>
                                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    Teachers ({teacherCount})
                                </Text>
                            </View>
                            {classData.teachers.map((teacher: any, index: number) => (
                                <View key={index} className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                    <View className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                                        <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                            {(teacher.name || 'T')[0].toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                                            {teacher.name || 'Teacher'}
                                        </Text>
                                        {teacher.email && (
                                            <Text className="text-sm text-gray-500 dark:text-gray-400">
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
                        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                            <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <View className="bg-green-100 dark:bg-green-900 p-2 rounded-xl mr-3">
                                    <Ionicons name="school" size={20} color="#10B981" />
                                </View>
                                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    Students ({studentCount})
                                </Text>
                            </View>
                            {classData.students.slice(0, 5).map((student: any, index: number) => (
                                <View key={index} className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                    <View className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center">
                                        <Text className="text-green-600 dark:text-green-400 font-bold text-lg">
                                            {(student.name || 'S')[0].toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                                            {student.name || 'Student'}
                                        </Text>
                                        {student.email && (
                                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                {student.email}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                            {classData.students.length > 5 && (
                                <View className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                    <Text className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium">
                                        +{classData.students.length - 5} more students
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Telegram Group Button */}
                    {classData.telegramGroupLink && (
                        <TouchableOpacity
                            onPress={() => classData.telegramGroupLink && Linking.openURL(classData.telegramGroupLink)}
                            className="active:opacity-90 mb-8"
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                className="p-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                            >
                                <Ionicons name="paper-plane" size={20} color="white" />
                                <Text className="text-white font-bold ml-2 text-base">Join Telegram Group</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

