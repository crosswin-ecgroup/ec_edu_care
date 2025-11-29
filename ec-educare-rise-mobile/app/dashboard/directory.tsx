import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';

type PersonType = 'teacher' | 'student';

interface Person {
    userId: string;
    name: string;
    email?: string;
    type: PersonType;
    grades: string[];
}

export default function Directory() {
    const router = useRouter();
    const { data: classes, isLoading } = useGetClassesQuery();
    const [selectedType, setSelectedType] = useState<PersonType>('teacher');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Aggregate all unique teachers and students with their grades
    const { teachers, students, grades } = useMemo(() => {
        if (!classes) return { teachers: [], students: [], grades: ['All'] };

        const teacherMap = new Map<string, Person>();
        const studentMap = new Map<string, Person>();
        const gradeSet = new Set<string>(['All']);

        classes.forEach(cls => {
            if (cls.standard) gradeSet.add(cls.standard);

            // Process teachers
            cls.teachers?.forEach(teacher => {
                if (!teacherMap.has(teacher.userId)) {
                    teacherMap.set(teacher.userId, {
                        ...teacher,
                        type: 'teacher',
                        grades: []
                    });
                }
                if (cls.standard && !teacherMap.get(teacher.userId)!.grades.includes(cls.standard)) {
                    teacherMap.get(teacher.userId)!.grades.push(cls.standard);
                }
            });

            // Process students
            cls.students?.forEach(student => {
                if (!studentMap.has(student.userId)) {
                    studentMap.set(student.userId, {
                        ...student,
                        type: 'student',
                        grades: []
                    });
                }
                if (cls.standard && !studentMap.get(student.userId)!.grades.includes(cls.standard)) {
                    studentMap.get(student.userId)!.grades.push(cls.standard);
                }
            });
        });

        return {
            teachers: Array.from(teacherMap.values()),
            students: Array.from(studentMap.values()),
            grades: Array.from(gradeSet)
        };
    }, [classes]);

    // Filter people based on search and grade
    const filteredPeople = useMemo(() => {
        const people = selectedType === 'teacher' ? teachers : students;

        return people.filter(person => {
            const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (person.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesGrade = selectedGrade === 'All' || person.grades.includes(selectedGrade);
            return matchesSearch && matchesGrade;
        });
    }, [selectedType, teachers, students, searchQuery, selectedGrade]);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1">
                <View className="p-4">
                    {/* Type Toggle */}
                    <View className="flex-row mb-4 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                        <TouchableOpacity
                            onPress={() => setSelectedType('teacher')}
                            className={`flex-1 py-3 rounded-lg ${selectedType === 'teacher' ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-bold ${selectedType === 'teacher' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                Teachers ({teachers.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedType('student')}
                            className={`flex-1 py-3 rounded-lg ${selectedType === 'student' ? 'bg-green-600' : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-bold ${selectedType === 'student' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                Students ({students.length})
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
                        filteredPeople.map((person) => (
                            <View
                                key={person.userId}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700"
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-12 h-12 rounded-full items-center justify-center ${selectedType === 'teacher'
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'bg-green-100 dark:bg-green-900'
                                        }`}>
                                        <Text className={`font-bold text-lg ${selectedType === 'teacher'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-green-600 dark:text-green-400'
                                            }`}>
                                            {person.name[0].toUpperCase()}
                                        </Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                            {person.name}
                                        </Text>
                                        {person.email && (
                                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                {person.email}
                                            </Text>
                                        )}
                                        {person.grades.length > 0 && (
                                            <View className="flex-row flex-wrap mt-2">
                                                {person.grades.map((grade, idx) => (
                                                    <View
                                                        key={idx}
                                                        className={`mr-2 mb-1 px-2 py-1 rounded ${selectedType === 'teacher'
                                                            ? 'bg-blue-100 dark:bg-blue-900'
                                                            : 'bg-green-100 dark:bg-green-900'
                                                            }`}
                                                    >
                                                        <Text className={`text-xs font-medium ${selectedType === 'teacher'
                                                            ? 'text-blue-700 dark:text-blue-300'
                                                            : 'text-green-700 dark:text-green-300'
                                                            }`}>
                                                            {grade}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))
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
        </View>
    );
}
