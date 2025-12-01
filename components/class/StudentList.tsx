import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StudentListProps {
    students: any[];
    onAddStudent: () => void;
    onRemoveStudent: (studentId: string) => void;
}

export const StudentList = ({ students, onAddStudent, onRemoveStudent }: StudentListProps) => {
    return (
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <View className="flex-row items-center">
                    <View className="bg-green-100 dark:bg-green-900 p-2 rounded-xl mr-3">
                        <Ionicons name="school" size={20} color="#10B981" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Students ({students?.length || 0})
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onAddStudent}
                    className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full"
                >
                    <Ionicons name="add" size={20} color="#10B981" />
                </TouchableOpacity>
            </View>
            {students && students.length > 0 ? (
                <>
                    {students.slice(0, 5).map((student: any, index: number) => (
                        <View key={index} className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <View className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center">
                                <Text className="text-green-600 dark:text-green-400 font-bold text-lg">
                                    {(student.fullName || student.name || 'S')[0].toUpperCase()}
                                </Text>
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                                    {student.fullName || student.name || 'Student'}
                                </Text>
                                {student.email && (
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        {student.email}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => onRemoveStudent(student.studentId || student.id)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full ml-2"
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {students.length > 5 && (
                        <View className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium">
                                +{students.length - 5} more students
                            </Text>
                        </View>
                    )}
                </>
            ) : (
                <View className="items-center py-8 opacity-50">
                    <Ionicons name="school-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">No students assigned</Text>
                </View>
            )}
        </View>
    );
};
