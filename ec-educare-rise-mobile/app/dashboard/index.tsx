import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { data: classes } = useGetClassesQuery();

    // Calculate statistics
    const stats = useMemo(() => {
        if (!classes) return { totalClasses: 0, totalTeachers: 0, totalStudents: 0, activeClasses: 0 };

        const teacherSet = new Set<string>();
        const studentSet = new Set<string>();
        const now = new Date();

        classes.forEach(cls => {
            cls.teachers?.forEach(t => teacherSet.add(t.userId));
            cls.students?.forEach(s => studentSet.add(s.userId));
        });

        const activeClasses = classes.filter(cls => {
            const endDate = new Date(cls.endDate);
            return endDate >= now;
        }).length;

        return {
            totalClasses: classes.length,
            totalTeachers: teacherSet.size,
            totalStudents: studentSet.size,
            activeClasses
        };
    }, [classes]);

    // Get recent/upcoming classes
    const recentClasses = useMemo(() => {
        if (!classes) return [];
        return [...classes]
            .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
            .slice(0, 3);
    }, [classes]);

    const quickActions = [
        { icon: 'add-circle', label: 'Create Class', color: 'bg-blue-600', route: '/dashboard/create-class' },
        { icon: 'person-add', label: 'Add Teacher', color: 'bg-purple-600', route: '/dashboard/create-teacher' },
        { icon: 'school', label: 'Add Student', color: 'bg-green-600', route: '/dashboard/create-student' },
        { icon: 'calendar', label: 'View Calendar', color: 'bg-orange-600', route: '/dashboard/calendar' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Welcome Section */}
                    <View className="mb-6 flex-row justify-between items-start">
                        <View>
                            <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Welcome back! 👋
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-400 mt-1">
                                {user?.name || 'Administrator'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/dashboard/profile')}
                            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm"
                        >
                            <Ionicons name="person-circle-outline" size={32} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>

                    {/* Statistics Cards */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                            Overview
                        </Text>
                        <View className="flex-row flex-wrap -mx-2">
                            {/* Total Classes */}
                            <View className="w-1/2 px-2 mb-4">
                                <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                            <Ionicons name="book" size={24} color="#3B82F6" />
                                        </View>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {stats.totalClasses}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Classes
                                    </Text>
                                </View>
                            </View>

                            {/* Active Classes */}
                            <View className="w-1/2 px-2 mb-4">
                                <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                                        </View>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {stats.activeClasses}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        Active Classes
                                    </Text>
                                </View>
                            </View>

                            {/* Total Teachers */}
                            <View className="w-1/2 px-2 mb-4">
                                <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                                            <Ionicons name="people" size={24} color="#A855F7" />
                                        </View>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {stats.totalTeachers}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        Teachers
                                    </Text>
                                </View>
                            </View>

                            {/* Total Students */}
                            <View className="w-1/2 px-2 mb-4">
                                <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                                            <Ionicons name="school" size={24} color="#F97316" />
                                        </View>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {stats.totalStudents}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        Students
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                            Quick Actions
                        </Text>
                        <View className="flex-row flex-wrap -mx-2">
                            {quickActions.map((action, index) => (
                                <View key={index} className="w-1/2 px-2 mb-3">
                                    <TouchableOpacity
                                        onPress={() => router.push(action.route as any)}
                                        className={`${action.color} p-4 rounded-xl shadow-sm active:opacity-90`}
                                    >
                                        <View className="items-center">
                                            <Ionicons name={action.icon as any} size={32} color="white" />
                                            <Text className="text-white font-semibold mt-2 text-center">
                                                {action.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Recent Classes */}
                    {recentClasses.length > 0 && (
                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    Recent Classes
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/dashboard/classes')}>
                                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                                        View All
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {recentClasses.map((cls) => (
                                <TouchableOpacity
                                    key={cls.classId}
                                    onPress={() => router.push(`/dashboard/class-details?id=${cls.classId}`)}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700 active:opacity-90"
                                >
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                {cls.name}
                                            </Text>
                                            <Text className="text-gray-600 dark:text-gray-400 mt-1">
                                                {cls.subject}
                                            </Text>
                                            <View className="flex-row items-center mt-2">
                                                <Ionicons name="people-outline" size={16} color="#6B7280" />
                                                <Text className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                    {cls.teachers?.length || 0} teachers • {cls.students?.length || 0} students
                                                </Text>
                                            </View>
                                        </View>
                                        {cls.standard && (
                                            <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                                <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                                                    {cls.standard}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
