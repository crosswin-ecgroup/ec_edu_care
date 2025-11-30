import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Classes() {
    const user = useAuthStore((state) => state.user);
    const { data: classes, isLoading, refetch } = useGetClassesQuery();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStandard, setFilterStandard] = useState('All');
    const insets = useSafeAreaInsets();

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
            className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1 mr-2">
                    <LinearGradient
                        colors={['#EFF6FF', '#DBEAFE']}
                        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    >
                        <Text className="text-xl font-bold text-blue-600">
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </LinearGradient>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                            {item.name}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            {item.subject}
                        </Text>
                    </View>
                </View>
                {item.standard && (
                    <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-800">
                        <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                            {item.standard}
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center pt-3 border-t border-gray-50 dark:border-gray-700/50">
                <View className="flex-row items-center mr-6">
                    <View className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full mr-2">
                        <Ionicons name="people" size={12} color="#6B7280" />
                    </View>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {item.students?.length || 0} Students
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <View className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full mr-2">
                        <Ionicons name="briefcase" size={12} color="#6B7280" />
                    </View>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {item.teachers?.length || 0} Teachers
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [handleClassPress]);

    const renderEmpty = useCallback(() => (
        <View className="items-center py-12 opacity-70">
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50 dark:bg-gray-900"
        >
            {/* Header */}
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: insets.top + 10, paddingBottom: 24 }}
                className="px-6 rounded-b-[32px] shadow-lg z-10"
            >
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">
                            Dashboard
                        </Text>
                        <Text className="text-3xl font-bold text-white">
                            Classes
                        </Text>
                    </View>
                    <View className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                        <Ionicons name="grid-outline" size={24} color="white" />
                    </View>
                </View>

                {/* Search Bar */}
                <View className="bg-white/20 p-1 rounded-2xl flex-row items-center border border-white/30 backdrop-blur-md overflow-hidden mb-4">
                    <View className="p-3">
                        <Ionicons name="search" size={20} color="white" />
                    </View>
                    <TextInput
                        className="flex-1 ml-1 text-white placeholder:text-blue-100 text-base font-medium"
                        placeholder="Search classes..."
                        placeholderTextColor="rgba(219, 234, 254, 0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="p-3">
                            <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filters */}
                <View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={standards}
                        keyExtractor={(item) => item}
                        renderItem={({ item: std }) => (
                            <TouchableOpacity
                                onPress={() => setFilterStandard(std || 'All')}
                                className={`mr-2 px-4 py-2 rounded-xl border ${filterStandard === std
                                    ? 'bg-white border-white shadow-sm'
                                    : 'bg-white/10 border-white/20'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-bold ${filterStandard === std
                                        ? 'text-blue-600'
                                        : 'text-blue-100'
                                        }`}
                                >
                                    {std}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </LinearGradient>

            {/* Content */}
            <View className="flex-1 -mt-4 px-4 pt-6">
                <View className="flex-row justify-between items-center mb-4 px-2">
                    <Text className="text-gray-500 dark:text-gray-400 font-medium">
                        {filteredClasses.length} Active {filteredClasses.length === 1 ? 'Class' : 'Classes'}
                    </Text>
                </View>

                <FlatList
                    data={filteredClasses}
                    keyExtractor={(item) => item.classId}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#4F46E5" />}
                    contentContainerClassName="pb-32"
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {isLoading && <LoadingOverlay />}

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={() => router.push('/dashboard/create-class')}
                className="absolute bottom-6 right-6 w-16 h-16 rounded-2xl items-center justify-center shadow-lg shadow-blue-600/30 active:scale-90 transition-all z-50"
            >
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    className="w-full h-full rounded-2xl items-center justify-center"
                >
                    <Ionicons name="add" size={32} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}
