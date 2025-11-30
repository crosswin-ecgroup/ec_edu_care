import React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingOverlay } from '@/components/LoadingOverlay';

interface PersonListProps {
    data: any[];
    isLoading: boolean;
    selectedType: 'teacher' | 'student';
    onPress: (id: string) => void;
    searchQuery: string;
    selectedGrade?: string;
}

export function PersonList({
    data,
    isLoading,
    selectedType,
    onPress,
    searchQuery,
    selectedGrade
}: PersonListProps) {
    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (data.length === 0) {
        return (
            <View className="items-center py-12 opacity-70">
                <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                    <Ionicons name={selectedType === 'teacher' ? 'people-outline' : 'school-outline'} size={48} color="#9CA3AF" />
                </View>
                <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    No {selectedType}s found
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center px-8">
                    {searchQuery || (selectedGrade && selectedGrade !== 'All')
                        ? 'Try adjusting your search or filters'
                        : `No ${selectedType}s have been added yet.`}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Count Header */}
            <View className="flex-row items-center justify-between mb-4 px-2">
                <Text className="text-gray-500 dark:text-gray-400 font-medium">
                    {data.length} {data.length === 1 ? 'Result' : 'Results'}
                </Text>
                <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700 ml-4" />
            </View>

            {data.map((person: any) => {
                const personId = selectedType === 'teacher' ? person.teacherId : person.studentId;
                const grade = selectedType === 'student' ? person.grade : null;

                return (
                    <TouchableWithoutFeedback
                        key={personId}
                        onPress={() => onPress(personId)}
                    >
                        <View className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 flex-row items-center">
                            <View className={`w-14 h-14 rounded-3xl items-center justify-center shadow-lg border ${selectedType === 'teacher'
                                ? 'bg-blue-500/20 border-blue-400/30'
                                : 'bg-green-500/20 border-green-400/30'
                                }`}>
                                <View className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                                <Text className={`font-bold text-xl z-10 ${selectedType === 'teacher'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-green-600 dark:text-green-400'
                                    }`}>
                                    {person.fullName[0].toUpperCase()}
                                </Text>
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {person.fullName}
                                </Text>

                                <View className="flex-row flex-wrap gap-2">
                                    {selectedType === 'teacher' && person.email && (
                                        <View className="flex-row items-center">
                                            <Ionicons name="mail-outline" size={12} color="#6B7280" />
                                            <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
                                                {person.email}
                                            </Text>
                                        </View>
                                    )}
                                    {grade && (
                                        <View className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-lg border border-green-200 dark:border-green-800">
                                            <Text className="text-xs font-bold text-green-700 dark:text-green-400">
                                                {grade}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full">
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            })}
        </ScrollView>
    );
}
