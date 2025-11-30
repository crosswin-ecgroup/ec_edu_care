import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
            cls.teachers?.forEach(t => teacherSet.add(t.teacherId));
            cls.students?.forEach(s => studentSet.add(s.studentId));
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
        { icon: 'add-circle', label: 'Create Class', color: ['#4F46E5', '#3730A3'], route: '/dashboard/create-class' },
        { icon: 'person-add', label: 'Add Teacher', color: ['#7C3AED', '#5B21B6'], route: '/dashboard/create-teacher' },
        { icon: 'school', label: 'Add Student', color: ['#059669', '#047857'], route: '/dashboard/create-student' },
        { icon: 'calendar', label: 'Calendar', color: ['#EA580C', '#C2410C'], route: '/dashboard/calendar' },
    ];

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Modern Header with Gradient */}
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-8 px-6 rounded-b-[32px] shadow-lg"
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-blue-100 text-lg font-medium">Welcome back,</Text>
                            <Text className="text-white text-3xl font-bold mt-1">
                                {user?.name || 'Administrator'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/dashboard/profile')}
                            className="bg-white/20 p-2 rounded-full border border-white/30"
                        >
                            <Ionicons name="person" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Stats Row */}
                    <View className="flex-row justify-between bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{stats.totalClasses}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Classes</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{stats.totalTeachers}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Teachers</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-bold text-white">{stats.totalStudents}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Students</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View className="px-6 -mt-6">
                    {/* Quick Actions */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-2">
                            Quick Actions
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                            className="-mx-6"
                        >
                            {quickActions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push(action.route as any)}
                                    className="mr-4"
                                    activeOpacity={0.9}
                                >
                                    <View className="w-32 h-40 bg-white dark:bg-gray-800 rounded-3xl p-4 justify-between shadow-lg shadow-blue-900/10 border border-gray-100 dark:border-gray-700">
                                        <View className="w-12 h-12 rounded-2xl items-center justify-center bg-gray-50 dark:bg-gray-700">
                                            <LinearGradient
                                                colors={action.color as any}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                className="w-12 h-12 rounded-2xl items-center justify-center opacity-90"
                                                style={{ borderRadius: 14 }}
                                            >
                                                <Ionicons name={action.icon as any} size={24} color="white" />
                                            </LinearGradient>
                                        </View>

                                        <View>
                                            <Text className="text-gray-900 dark:text-white font-bold text-lg leading-6">
                                                {action.label.split(' ')[0]}
                                            </Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                                {action.label.split(' ').slice(1).join(' ')}
                                            </Text>
                                        </View>

                                        <View className="absolute right-0 bottom-0 opacity-5">
                                            <Ionicons name={action.icon as any} size={80} color="black" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>{/* Recent Classes Section */}
                    {recentClasses.length > 0 && (
                        <View className="mt-4 mb-20">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    Recent Classes
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/dashboard/classes')}>
                                    <Text className="text-blue-600 dark:text-blue-400 font-medium">See All</Text>
                                </TouchableOpacity>
                            </View>

                            {recentClasses.map((cls) => (
                                <TouchableOpacity
                                    key={cls.classId}
                                    onPress={() => router.push(`/dashboard/class-details?id=${cls.classId}`)}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700 flex-row items-center"
                                    activeOpacity={0.7}
                                >
                                    <View className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-4">
                                        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {cls.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                                            {cls.name}
                                        </Text>
                                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                                            {cls.subject} • {cls.standard || 'No Grade'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
