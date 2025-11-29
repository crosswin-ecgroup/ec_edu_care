import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetTeachersQuery, useGetStudentsQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type PersonType = 'teacher' | 'student';

export default function Directory() {
    const [selectedType, setSelectedType] = useState<PersonType>('teacher');
    const router = useRouter();
    const { data: teachers, isLoading: teachersLoading } = useGetTeachersQuery(undefined, {
        skip: selectedType !== 'teacher'
    });
    const { data: students, isLoading: studentsLoading } = useGetStudentsQuery(undefined, {
        skip: selectedType !== 'student'
    });
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique grades from students
    const grades = useMemo(() => {
        if (!students) return ['All'];
        const gradeSet = new Set<string>(['All']);
        students.forEach(student => {
            if (student.grade) gradeSet.add(student.grade);
        });
        return Array.from(gradeSet);
    }, [students]);

    // Filter people based on search and grade
    const filteredPeople = useMemo(() => {
        const people = selectedType === 'teacher' ? (teachers || []) : (students || []);

        return people.filter(person => {
            const matchesSearch = person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (person.mobileNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            // For teachers, also search by email
            if (selectedType === 'teacher') {
                const teacher = person as NonNullable<typeof teachers>[number];
                return matchesSearch || (teacher.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            }

            // For students, filter by grade
            if (selectedType === 'student' && selectedGrade !== 'All') {
                const student = person as NonNullable<typeof students>[number];
                return matchesSearch && student.grade === selectedGrade;
            }

            return matchesSearch;
        });
    }, [selectedType, teachers, students, searchQuery, selectedGrade]);

    if (teachersLoading || studentsLoading) {
        return <LoadingOverlay />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
            <ScrollView className="flex-1">
                <View className="p-4">
                    {/* Header */}
                    <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Directory
                    </Text>

                    {/* Type Toggle */}
                    <View className="flex-row mb-4 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                        <TouchableOpacity
                            onPress={() => setSelectedType('teacher')}
                            className={`flex-1 py-3 rounded-lg ${selectedType === 'teacher' ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-bold ${selectedType === 'teacher' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                Teachers ({teachers?.length || 0})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedType('student')}
                            className={`flex-1 py-3 rounded-lg ${selectedType === 'student' ? 'bg-green-600' : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-bold ${selectedType === 'student' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                Students ({students?.length || 0})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm mb-3 flex-row items-center">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-800 dark:text-gray-100"
                            placeholder={`Search ${selectedType}s...`}
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

                    {/* Grade Filter Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        <View className="flex-row">
                            {grades.map((grade) => (
                                <TouchableOpacity
                                    key={grade}
                                    onPress={() => setSelectedGrade(grade)}
                                    className={`mr-2 px-4 py-2 rounded-full ${selectedGrade === grade
                                        ? selectedType === 'teacher' ? 'bg-blue-600' : 'bg-green-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${selectedGrade === grade
                                            ? 'text-white'
                                            : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {grade}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Results Count */}
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {filteredPeople.length} {filteredPeople.length === 1 ? selectedType : `${selectedType}s`} found
                    </Text>

                    {/* People List */}
                    {filteredPeople.length > 0 ? (
                        filteredPeople.map((person) => {
                            const personId = selectedType === 'teacher'
                                ? (person as any).teacherId
                                : (person as any).studentId;
                            const grade = selectedType === 'student' ? (person as any).grade : null;

                            return (
                                <TouchableOpacity
                                    key={personId}
                                    onPress={() => {
                                        if (selectedType === 'teacher') {
                                            router.push(`/dashboard/teacher-details?id=${personId}`);
                                        } else {
                                            router.push(`/dashboard/student-details?id=${personId}`);
                                        }
                                    }}>
                                    <View
                                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700"
                                    >
                                        <View className="flex-row items-center">
                                            <View className={`w-12 h-12 rounded-full items-center justify-center ${selectedType === 'teacher'
                                                ? 'bg-blue-100 dark:bg-blue-900'
                                                : 'bg-green-100 dark:bg-green-900'}
                                            `}>
                                                <Text className={`font-bold text-lg ${selectedType === 'teacher'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-green-600 dark:text-green-400'}
                                                `}>
                                                    {person.fullName[0].toUpperCase()}
                                                </Text>
                                            </View>
                                            <View className="ml-3 flex-1">
                                                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                                    {person.fullName}
                                                </Text>
                                                {selectedType === 'teacher' && (person as NonNullable<typeof teachers>[number]).email && (
                                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                        {(person as NonNullable<typeof teachers>[number]).email}
                                                    </Text>
                                                )}
                                                {person.mobileNumber && (
                                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                        {person.mobileNumber}
                                                    </Text>
                                                )}
                                                {grade && (
                                                    <View className="flex-row flex-wrap mt-2">
                                                        <View className="mr-2 mb-1 px-2 py-1 rounded bg-green-100 dark:bg-green-900">
                                                            <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                                                                {grade}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View className="items-center py-12">
                            <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                <Ionicons name={selectedType === 'teacher' ? 'people-outline' : 'school-outline'} size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                No {selectedType}s found
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center px-8">
                                {searchQuery || selectedGrade !== 'All'
                                    ? 'Try adjusting your search or filters'
                                    : `No ${selectedType}s have been added yet.`}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={() => router.push(selectedType === 'teacher' ? '/dashboard/create-teacher' : '/dashboard/create-student')}
                className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg active:opacity-90 ${selectedType === 'teacher' ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                style={{ elevation: 5 }}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
