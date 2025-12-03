import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TeacherListProps {
    teachers: any[];
    onAddTeacher: () => void;
    onRemoveTeacher: (teacherId: string) => void;
}

export const TeacherList = ({ teachers, onAddTeacher, onRemoveTeacher }: TeacherListProps) => {
    const router = useRouter();
    return (
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <View className="flex-row items-center">
                    <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-xl mr-3">
                        <Ionicons name="person" size={20} color="#3B82F6" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Teachers ({teachers?.length || 0})
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onAddTeacher}
                    className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full"
                >
                    <Ionicons name="add" size={20} color="#3B82F6" />
                </TouchableOpacity>
            </View>
            {teachers && teachers.length > 0 ? (
                teachers.map((teacher: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(`/teacher/${teacher.teacherId || teacher.id}` as any)}
                        className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50"
                    >
                        <View className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                            <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                {(teacher.fullName || teacher.name || 'T')[0].toUpperCase()}
                            </Text>
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                                {teacher.fullName || teacher.name || 'Teacher'}
                            </Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {teacher.specialization || teacher.email || 'No specialization'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onRemoveTeacher(teacher.teacherId || teacher.id);
                            }}
                            className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full ml-2"
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))
            ) : (
                <View className="items-center py-8 opacity-50">
                    <Ionicons name="person-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">No teachers assigned</Text>
                </View>
            )}
        </View>
    );
};
