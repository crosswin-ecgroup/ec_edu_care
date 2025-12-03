import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useGetAssignmentsGroupedQuery } from '@/services/classes.api';
import { AssignmentGroupSummaryDto } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssignmentList() {
    const { id: classId } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: assignmentsGrouped, isLoading } = useGetAssignmentsGroupedQuery(classId);

    if (isLoading) return <LoadingOverlay />;

    const renderItem = ({ item }: { item: AssignmentGroupSummaryDto }) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: `/class/${classId}/assignments/${item.assignmentBatchId}`,
                params: { title: item.title }
            })}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                    <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        {item.title}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
                        {item.description || 'No description'}
                    </Text>
                </View>
                <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                    <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {item.submissionCount}/{item.studentCount}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <View className="flex-row items-center flex-1">
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                </View>
                <View className="flex-row items-center flex-1">
                    <Ionicons name="star-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Max: <Text className="font-bold text-gray-700 dark:text-gray-300">{item.maxScore}</Text>
                    </Text>
                </View>
                <View className="flex-row items-center flex-1">
                    <Ionicons name="trophy-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        Avg: <Text className="font-bold text-gray-700 dark:text-gray-300">{item.averageGrade?.toFixed(1) || '-'}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                    <Text className="text-2xl font-bold text-white flex-1">
                        Assignments
                    </Text>
                </View>

                <View className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                    <Text className="text-white/80 text-sm mb-1">Total Assignments</Text>
                    <Text className="text-3xl font-bold text-white">
                        {assignmentsGrouped?.length || 0}
                    </Text>
                </View>
            </LinearGradient>

            <FlatList
                data={assignmentsGrouped}
                renderItem={renderItem}
                keyExtractor={(item) => item.assignmentBatchId}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Ionicons name="documents-outline" size={64} color="#9CA3AF" />
                        <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">No assignments found</Text>
                        <Text className="text-gray-400 dark:text-gray-500 mt-2 text-center">
                            Assignments will appear here when they are created
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
