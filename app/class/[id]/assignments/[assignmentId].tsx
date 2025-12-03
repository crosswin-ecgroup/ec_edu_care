import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useGetAssignmentsWithSubmissionsQuery } from '@/services/classes.api';
import { AssignmentWithSubmissionDto } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssignmentDetails() {
    const { id: classId, assignmentId, title } = useLocalSearchParams<{ id: string; assignmentId: string; title: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: allSubmissions, isLoading } = useGetAssignmentsWithSubmissionsQuery(classId);

    const assignmentSubmissions = useMemo(() => {
        if (!allSubmissions || !title) return [];
        // Filter by title since we don't have a direct batch ID link in the DTO
        return allSubmissions.filter((sub: AssignmentWithSubmissionDto) => sub.title === title);
    }, [allSubmissions, title]);

    const assignmentDetails = assignmentSubmissions[0];

    if (isLoading) return <LoadingOverlay />;

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'submitted':
                return 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800';
            case 'graded':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800';
            case 'late':
                return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800';
            case 'missing':
            case 'pending':
                return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700';
        }
    };

    const renderItem = ({ item }: { item: AssignmentWithSubmissionDto }) => {
        const statusStyle = getStatusColor(item.status || 'pending');
        const [textColor, ...bgClasses] = statusStyle.split(' ');

        return (
            <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-3 border border-gray-100 dark:border-gray-700">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                            {item.studentName}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {item.studentEmail || 'No email'}
                        </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full border ${bgClasses.join(' ')}`}>
                        <Text className={`text-xs font-bold capitalize ${textColor}`}>
                            {item.status || 'Pending'}
                        </Text>
                    </View>
                </View>

                {/* Grade and Feedback Section */}
                {(item.grade !== undefined || item.feedback) ? (
                    <View className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        {item.grade !== undefined && (
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="ribbon-outline" size={16} color="#4F46E5" />
                                <Text className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Grade: <Text className="text-blue-600 dark:text-blue-400">{item.grade}/{item.maxScore}</Text>
                                </Text>
                            </View>
                        )}
                        {item.feedback && (
                            <View className="flex-row items-start mt-1">
                                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#6B7280" style={{ marginTop: 2 }} />
                                <Text className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex-1">
                                    {item.feedback}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                            <Text className="ml-2 text-sm text-gray-500 dark:text-gray-400 italic">
                                Not graded yet
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
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
                    <Text className="text-2xl font-bold text-white flex-1" numberOfLines={1}>
                        Assignment Details
                    </Text>
                </View>

                {assignmentDetails && (
                    <View className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <Text className="text-xl font-bold text-white mb-2">{assignmentDetails.title}</Text>
                        <View className="flex-row flex-wrap gap-4">
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#BFDBFE" />
                                <Text className="text-blue-100 ml-2 text-sm">
                                    Due: {new Date(assignmentDetails.dueDate).toLocaleDateString()}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="star-outline" size={16} color="#BFDBFE" />
                                <Text className="text-blue-100 ml-2 text-sm">
                                    Max Score: {assignmentDetails.maxScore}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <FlatList
                data={assignmentSubmissions}
                renderItem={renderItem}
                keyExtractor={(item) => item.classStudentAssignmentId || item.studentId}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-10">
                        <Ionicons name="documents-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 mt-4">No submissions found</Text>
                    </View>
                }
            />
        </View>
    );
}
