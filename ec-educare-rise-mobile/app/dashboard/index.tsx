import React from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { data: classes, isLoading, refetch } = useGetClassesQuery();
    const router = useRouter();

    const handleClassPress = (classId: string) => {
        router.push(`/dashboard/class-details?id=${classId}`);
    };

    const renderHeader = () => (
        <TouchableOpacity
            onPress={() => router.push('/dashboard/profile')}
            className="mb-6 bg-blue-600 dark:bg-blue-800 p-6 rounded-3xl shadow-lg active:opacity-90"
        >
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-blue-100 text-lg font-medium">Welcome back,</Text>
                    <Text className="text-3xl font-bold text-white">{user?.name || 'Student'}</Text>
                </View>
                <View className="bg-white/20 p-2 rounded-full">
                    <Ionicons name="school" size={32} color="white" />
                </View>
            </View>
            <View className="flex-row items-center bg-blue-700 dark:bg-blue-900/50 p-3 rounded-xl self-start">
                <Ionicons name="person-circle-outline" size={20} color="#BFDBFE" />
                <Text className="text-blue-100 ml-2 font-medium">{user?.role || 'Student'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
                <LoadingOverlay />
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={(item) => item.classId}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />}
                    contentContainerClassName="p-4 pb-20"
                    ListHeaderComponent={() => (
                        <>
                            {renderHeader()}
                            <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 ml-1">
                                Your Classes
                            </Text>
                        </>
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleClassPress(item.classId)}
                            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-2">
                                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                        {item.name}
                                    </Text>
                                    <Text className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                                        {item.subject}
                                    </Text>
                                </View>
                                {item.standard && (
                                    <View className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                        <Text className="text-gray-600 dark:text-gray-300 text-xs font-bold">
                                            {item.standard}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <View className="flex-row items-center mr-4">
                                    <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                                    <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                                        {item.dayOfWeek ? item.dayOfWeek.length : 0} Days
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="people-outline" size={16} color="#9CA3AF" />
                                    <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                                        {item.students ? item.students.length : 0} Students
                                    </Text>
                                </View>
                                <View className="flex-1 flex-row justify-end items-center">
                                    <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold mr-1">View Details</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="items-center py-12">
                            <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                <Ionicons name="book-outline" size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium">No classes found</Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center px-8">
                                You haven't been assigned to any classes yet.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Floating Action Button for Creating Class */}
            <TouchableOpacity
                onPress={() => router.push('/dashboard/create-class')}
                className="absolute bottom-6 right-6 bg-blue-600 dark:bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg active:bg-blue-700 dark:active:bg-blue-600"
                style={{ elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
