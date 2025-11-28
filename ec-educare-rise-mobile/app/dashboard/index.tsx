import React from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { data: classes, isLoading, refetch } = useGetClassesQuery();
    const router = useRouter();

    const handleClassPress = (classId: string) => {
        router.push(`/dashboard/class-details?id=${classId}`);
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user?.name || 'User'}!</Text>
                <Text className="text-gray-600 dark:text-gray-400">Role: {user?.role || 'Student'}</Text>
            </View>

            <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Classes</Text>

            {isLoading ? (
                <LoadingOverlay />
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={(item) => item.classId}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleClassPress(item.classId)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 active:opacity-70"
                        >
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.name}</Text>
                            <Text className="text-gray-600 dark:text-gray-400">{item.subject}</Text>
                            {item.standard && (
                                <Text className="text-sm text-gray-500 dark:text-gray-500 mt-1">Standard: {item.standard}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="items-center py-8">
                            <Text className="text-gray-500 dark:text-gray-400 mb-4">No classes found.</Text>
                            {/* Admin actions could go here */}
                        </View>
                    }
                />
            )}
        </View>
    );
}
