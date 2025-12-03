import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StudentListProps {
    students: any[];
    onAddStudent: () => void;
    onRemoveStudent: (studentId: string) => void;
}

export const StudentList = ({ students, onAddStudent, onRemoveStudent }: StudentListProps) => {
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const displayedStudents = showAll ? students : students.slice(0, 5);

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
                    {displayedStudents.map((student: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push(`/student/${student.studentId || student.id}` as any)}
                            className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50"
                        >
                            <View className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center">
                                <Text className="text-green-600 dark:text-green-400 font-bold text-lg">
                                    {(student.fullName || student.name || 'S')[0].toUpperCase()}
                                </Text>
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                                    {student.fullName || student.name || 'Student'}
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    {student.mobileNumber || student.email || 'No contact info'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onRemoveStudent(student.studentId || student.id);
                                }}
                                className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full ml-2"
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                    {students.length > 5 && (
                        <TouchableOpacity
                            className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800"
                            activeOpacity={0.7}
                            onPress={() => setShowAll(!showAll)}
                        >
                            <Text className="text-sm text-blue-600 dark:text-blue-400 text-center font-bold">
                                {showAll ? 'Show Less' : `View All ${students.length} Students`}
                            </Text>
                        </TouchableOpacity>
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
