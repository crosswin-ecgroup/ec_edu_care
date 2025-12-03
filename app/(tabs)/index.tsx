import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useGetAcademicYearReportQuery } from '../../services/academicYear.api';
import { useAuthStore } from '../../store/auth.store';
import { getSubjectIcon } from '../../utils/subjectIcons';

export default function Dashboard() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { data: report, isLoading: reportLoading } = useGetAcademicYearReportQuery('2025-2026');



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
                            <Text className="text-blue-200 text-sm mt-1 font-medium bg-white/10 self-start px-3 py-1 rounded-full overflow-hidden">
                                Academic Year 2025-2026
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/profile' as any)}
                            className="bg-white/20 p-2 rounded-full border border-white/30"
                        >
                            <Ionicons name="person" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Stats Row */}
                    <View className="flex-row justify-between bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{report?.totalClasses || 0}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Classes</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{report?.totalTeachers || 0}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Teachers</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-bold text-white">{report?.totalStudents || 0}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Students</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View className="px-6 mt-4">
                    {/* Academic Year Report Stats */}
                    {report && (
                        <View className="mb-6">
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Academic Year Overview
                            </Text>
                            <View className="flex-row flex-wrap gap-3 mb-4">
                                <View className="flex-1 min-w-[45%] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-2">
                                            <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
                                        </View>
                                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Sessions</Text>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">{report.completedSessions}/{report.totalSessions}</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completed</Text>
                                </View>
                                <View className="flex-1 min-w-[45%] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-2">
                                            <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
                                        </View>
                                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Attendance</Text>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(report.overallAttendanceRate)}%</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall Rate</Text>
                                </View>
                                <View className="flex-1 min-w-[45%] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-2">
                                            <Ionicons name="document-text-outline" size={18} color="#8B5CF6" />
                                        </View>
                                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Assignments</Text>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">{report.totalAssignments}</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(report.overallSubmissionRate)}% submitted</Text>
                                </View>
                                <View className="flex-1 min-w-[45%] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-2">
                                            <Ionicons name="star-outline" size={18} color="#F59E0B" />
                                        </View>
                                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Avg Grade</Text>
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">{report.averageGrade?.toFixed(1) || '-'}</Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Out of 100</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Interesting Content */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Did You Know?
                        </Text>
                        <View className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 flex-row">
                            <View className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full h-10 w-10 items-center justify-center mr-3">
                                <Ionicons name="bulb" size={20} color="#D97706" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-amber-900 dark:text-amber-100 font-bold mb-1">
                                    Daily Tip
                                </Text>
                                <Text className="text-amber-800 dark:text-amber-200 text-sm leading-5">
                                    Regular communication with parents improves student performance by 25%. Try sending a weekly update!
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Today's Classes Section */}
                    {/* Class Performance Summary */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Class Performance Summary
                        </Text>
                        {reportLoading ? (
                            <DashboardSkeleton />
                        ) : report?.classes && report.classes.length > 0 ? (
                            report.classes.map((cls, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push(`/class/${cls.classId}` as any)}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3 border border-gray-100 dark:border-gray-700"
                                >
                                    <View className="flex-row justify-between items-start mb-3">
                                        <View className="flex-row items-center">
                                            <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-3">
                                                <Ionicons name={getSubjectIcon(cls.subject || 'default')} size={20} color="#3B82F6" />
                                            </View>
                                            <View>
                                                <Text className="text-base font-bold text-gray-800 dark:text-gray-100">
                                                    {cls.className}
                                                </Text>
                                                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                                    {cls.studentCount} Students
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                                            <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                                                Avg: {cls.averageGrade?.toFixed(1) || '-'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                                        <View className="items-center flex-1 border-r border-gray-50 dark:border-gray-700/50">
                                            <Text className="text-gray-900 dark:text-white font-bold">{Math.round(cls.attendanceRate || 0)}%</Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">Attendance</Text>
                                        </View>
                                        <View className="items-center flex-1">
                                            <Text className="text-gray-900 dark:text-white font-bold">{Math.round(cls.submissionRate || 0)}%</Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">Submissions</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text className="text-gray-500 dark:text-gray-400 text-center py-4">No class data available</Text>
                        )}
                    </View>

                    {/* Teacher Performance Summary */}
                    <View className="mb-20">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Teacher Performance Summary
                        </Text>
                        {report?.teacherPerformances && report.teacherPerformances.length > 0 ? (
                            report.teacherPerformances.map((teacher, index) => (
                                <View
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3 border border-gray-100 dark:border-gray-700"
                                >
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center">
                                            <View className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 items-center justify-center mr-3">
                                                <Text className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                                                    {teacher.teacherName?.charAt(0) || 'T'}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text className="text-base font-bold text-gray-800 dark:text-gray-100">
                                                    {teacher.teacherName}
                                                </Text>
                                                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                                    {teacher.totalStudents} Students • {teacher.classCount} Classes
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                                        <View className="items-center flex-1 border-r border-gray-50 dark:border-gray-700/50">
                                            <Text className="text-gray-900 dark:text-white font-bold">{Math.round(teacher.averageAttendanceRate || 0)}%</Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">Attendance</Text>
                                        </View>
                                        <View className="items-center flex-1">
                                            <Text className="text-gray-900 dark:text-white font-bold">{Math.round(teacher.averageSubmissionRate || 0)}%</Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">Submissions</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-gray-500 dark:text-gray-400 text-center py-4">No teacher data available</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
