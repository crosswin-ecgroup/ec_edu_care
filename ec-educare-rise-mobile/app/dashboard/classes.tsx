import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { data: classes, isLoading, refetch } = useGetClassesQuery();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStandard, setFilterStandard] = useState('All');

    const handleClassPress = useCallback((classId: string) => {
        router.push(`/dashboard/class-details?id=${classId}`);
    }, [router]);

    const filteredClasses = useMemo(() => {
        return classes?.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cls.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesFilter = filterStandard === 'All' || cls.standard === filterStandard;
            return matchesSearch && matchesFilter;
        }) || [];
    }, [classes, searchQuery, filterStandard]);

    const standards = useMemo(() => {
        return ['All', ...Array.from(new Set(classes?.map(c => c.standard).filter(Boolean) || []))];
    }, [classes]);

    const renderItem = useCallback(({ item }: any) => (
        <TouchableOpacity
            onPress={() => handleClassPress(item.classId)}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 active:opacity-90"
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                        {item.name}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 mt-1">
                        {item.subject}
                    </Text>
                </View>
                {item.standard && (
                    <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                        <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                            {item.standard}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center mt-3">
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                    {item.teachers?.length || 0} teachers • {item.students?.length || 0} students
                </Text>
            </View>
        </TouchableOpacity>
    ), [handleClassPress]);

    const renderEmpty = useCallback(() => (
        <View className="items-center py-12">
            <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium">No classes found</Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center px-8">
                {searchQuery || filterStandard !== 'All'
                    ? 'Try adjusting your search or filters'
                    : 'No classes have been created yet.'}
            </Text>
        </View>
    ), [searchQuery, filterStandard]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
            <View className="p-4 pb-0">
                <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Class Management
                </Text>

                {/* Search Bar */}
                <View className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm mb-3 flex-row items-center">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 ml-2 text-gray-800 dark:text-gray-100"
                        placeholder="Search classes..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Pills */}
                <View className="flex-row flex-wrap mb-2">
                    {standards.map((std) => (
                        <TouchableOpacity
                            key={std}
                            onPress={() => setFilterStandard(std || 'All')}
                            className={`mr-2 mb-2 px-4 py-2 rounded-full ${filterStandard === std
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <Text
                                className={`text-sm font-medium ${filterStandard === std
                                    ? 'text-white'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {std}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
                </Text>
            </View>

            <FlatList
                data={filteredClasses}
                keyExtractor={(item) => item.classId}
                keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />}
                contentContainerClassName="p-4 pt-0 pb-20"
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
            />

            {isLoading && <LoadingOverlay />}

            {/* Floating Action Button for Creating Class */}
            <TouchableOpacity
                onPress={() => router.push('/dashboard/create-class')}
                className="absolute bottom-6 right-6 bg-blue-600 dark:bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg active:bg-blue-700 dark:active:bg-blue-600"
                style={{ elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
