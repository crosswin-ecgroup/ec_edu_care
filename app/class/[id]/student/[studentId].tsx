import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useGetStudentClassDetailQuery } from '@/services/classes.api';
import { ClassStudentDetailDto, StudentAssignmentRecordDto, StudentAttendanceRecordDto } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentClassDetails() {
    const { id: classId, studentId } = useLocalSearchParams<{ id: string; studentId: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [showAllAttendance, setShowAllAttendance] = useState(false);
    const [showAllAssignments, setShowAllAssignments] = useState(false);

    const { data: studentDetail, isLoading } = useGetStudentClassDetailQuery({ classId, studentId });

    if (isLoading) return <LoadingOverlay />;
    if (!studentDetail) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Student details not found</Text>
            </View>
        );
    }

    const detail = studentDetail as ClassStudentDetailDto;
    const { summary } = detail;

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'present':
                return 'text-green-700 dark:text-white bg-green-50 dark:bg-green-600';
            case 'late':
                return 'text-orange-700 dark:text-white bg-orange-50 dark:bg-orange-600';
            case 'absent':
                return 'text-red-700 dark:text-white bg-red-50 dark:bg-red-600';
            case 'not marked':
            case 'not_marked':
                return 'text-yellow-700 dark:text-white bg-yellow-50 dark:bg-yellow-600';
            case 'submitted':
            case 'graded':
                return 'text-blue-700 dark:text-white bg-blue-50 dark:bg-blue-600';
            case 'assigned':
            case 'pending':
                return 'text-purple-700 dark:text-white bg-purple-50 dark:bg-purple-600';
            case 'missing':
            case 'not submitted':
            case 'not_submitted':
                return 'text-red-700 dark:text-white bg-red-50 dark:bg-red-600';
            default:
                return 'text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600';
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: insets.top + 10, paddingBottom: 24 }}
                className="px-6 rounded-b-[32px] shadow-lg z-10"
            >
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-white/20 p-2 rounded-full mr-4 backdrop-blur-md"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white">{detail.fullName}</Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-white/80 text-sm">{detail.className}</Text>
                            {detail.grade && (
                                <>
                                    <Text className="text-white/60 mx-2">•</Text>
                                    <Text className="text-white/80 text-sm">Grade {detail.grade}</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                {/* Stats Overview */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Performance Summary</Text>
                    <View className="space-y-3">
                        <View className="flex-row justify-between items-center py-2">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                <Text className="text-gray-700 dark:text-gray-300 ml-2">Attendance Rate</Text>
                            </View>
                            <Text className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {Math.round(summary.attendancePercentage)}%
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center py-2">
                            <View className="flex-row items-center">
                                <Ionicons name="document-attach" size={20} color="#3B82F6" />
                                <Text className="text-gray-700 dark:text-gray-300 ml-2">Submission Rate</Text>
                            </View>
                            <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(summary.submissionRate)}%
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center py-2">
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Text className="text-gray-700 dark:text-gray-300 ml-2">Average Score</Text>
                            </View>
                            <Text className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                {summary.averageScore?.toFixed(1) || '-'}
                            </Text>
                        </View>
                        {summary.overallGrade && (
                            <View className="flex-row justify-between items-center py-2">
                                <View className="flex-row items-center">
                                    <Ionicons name="ribbon" size={20} color="#8B5CF6" />
                                    <Text className="text-gray-700 dark:text-gray-300 ml-2">Overall Grade</Text>
                                </View>
                                <Text className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                    {summary.overallGrade}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Attendance Details */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Attendance Stats</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-3">
                        <View className="flex-1 min-w-[100px] bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl">
                            <Text className="text-emerald-700 dark:text-emerald-400 text-xs mb-1">Present</Text>
                            <Text className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {summary.attendedSessions}
                            </Text>
                        </View>
                        <View className="flex-1 min-w-[100px] bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl">
                            <Text className="text-orange-700 dark:text-orange-400 text-xs mb-1">Late</Text>
                            <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {summary.lateCount}
                            </Text>
                        </View>
                        <View className="flex-1 min-w-[100px] bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                            <Text className="text-red-700 dark:text-red-400 text-xs mb-1">Absent</Text>
                            <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {summary.absentCount}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Attendance History */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Attendance History</Text>
                        {detail.attendanceRecords && detail.attendanceRecords.length > 5 && (
                            <TouchableOpacity
                                onPress={() => setShowAllAttendance(!showAllAttendance)}
                                className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg"
                            >
                                <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                                    {showAllAttendance ? 'Show Less' : `View All (${detail.attendanceRecords.length})`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {detail.attendanceRecords && detail.attendanceRecords.length > 0 ? (
                        (showAllAttendance ? detail.attendanceRecords : detail.attendanceRecords.slice(0, 5)).map((record: StudentAttendanceRecordDto, index) => (
                            <View
                                key={index}
                                className="flex-row justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                                <View className="flex-1">
                                    <Text className="text-gray-800 dark:text-gray-100 font-semibold">
                                        {new Date(record.sessionDate).toLocaleDateString()}
                                    </Text>
                                    {record.markedAt && (
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                                            Marked: {new Date(record.markedAt).toLocaleTimeString()}
                                        </Text>
                                    )}
                                </View>
                                <View className={`px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                                    <Text className="text-xs font-bold capitalize">
                                        {record.status}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500 dark:text-gray-400 text-center py-4">No attendance records</Text>
                    )}
                </View>

                {/* Assignment Records */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Assignments</Text>
                        {detail.assignmentRecords && detail.assignmentRecords.length > 5 && (
                            <TouchableOpacity
                                onPress={() => setShowAllAssignments(!showAllAssignments)}
                                className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg"
                            >
                                <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                                    {showAllAssignments ? 'Show Less' : `View All (${detail.assignmentRecords.length})`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {detail.assignmentRecords && detail.assignmentRecords.length > 0 ? (
                        (showAllAssignments ? detail.assignmentRecords : detail.assignmentRecords.slice(0, 5)).map((record: StudentAssignmentRecordDto, index) => (
                            <View
                                key={index}
                                className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                            {record.title}
                                        </Text>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                                            Due: {new Date(record.dueDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                                        <Text className="text-xs font-bold capitalize">
                                            {record.status}
                                        </Text>
                                    </View>
                                </View>
                                {(record.grade !== undefined || record.feedback) && (
                                    <View className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                        {record.grade !== undefined && (
                                            <View className="flex-row items-center mb-1">
                                                <Ionicons name="ribbon-outline" size={14} color="#6B7280" />
                                                <Text className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    Grade: <Text className="font-bold text-blue-600 dark:text-blue-400">{record.grade}/{record.maxScore}</Text>
                                                </Text>
                                            </View>
                                        )}
                                        {record.feedback && (
                                            <View className="flex-row items-start mt-1">
                                                <Ionicons name="chatbubble-ellipses-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
                                                <Text className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex-1">
                                                    {record.feedback}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500 dark:text-gray-400 text-center py-4">No assignment records</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
