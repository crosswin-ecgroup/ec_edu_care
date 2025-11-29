import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Classes() {
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
                <View className="flex-row items-center flex-1 mr-2">
                    <View className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-3">
                        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                            {item.name}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.subject}
                        </Text>
                    </View>
                </View>
                {item.standard && (
                    <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                        <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                            {item.standard}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <View className="flex-row items-center mr-4">
                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                        {item.students?.length || 0} Students
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                        {item.teachers?.length || 0} Teachers
                    </Text>
                </View>
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
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Gradient Header */}
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="pt-14 pb-6 px-6 rounded-b-[32px] shadow-lg z-10"
            >
                <Text className="text-3xl font-bold text-white mb-4">
                    Class Management
                </Text>

                {/* Search Bar */}
                <View className="bg-white/20 p-1 rounded-xl flex-row items-center border border-white/30 backdrop-blur-md">
                    <View className="p-2">
                        <Ionicons name="search" size={20} color="white" />
                    </View>
                    <TextInput
                        className="flex-1 ml-1 text-white placeholder:text-blue-100"
                        placeholder="Search classes..."
                        placeholderTextColor="rgba(219, 234, 254, 0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
                            <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <View className="flex-1">
                {/* Filter Pills */}
                <View className="px-4 py-4">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={standards}
                        keyExtractor={(item) => item}
                        renderItem={({ item: std }) => (
                            <TouchableOpacity
                                onPress={() => setFilterStandard(std || 'All')}
                                className={`mr-2 px-4 py-2 rounded-full border ${filterStandard === std
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
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
                        )}
                    />
                </View>

                <View className="px-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
                    </Text>
                </View>

                <FlatList
                    data={filteredClasses}
                    keyExtractor={(item) => item.classId}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#4F46E5" />}
                    contentContainerClassName="px-4 pb-24"
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                />
            </View>

            {isLoading && <LoadingOverlay />}

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={() => router.push('/dashboard/create-class')}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            >
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    className="w-full h-full rounded-full items-center justify-center"
                >
                    <Ionicons name="add" size={30} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}
