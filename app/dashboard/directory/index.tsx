import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetTeachersQuery, useGetStudentsQuery } from '@/services/classes.api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DirectoryHeader } from './components/DirectoryHeader';
import { PersonList } from './components/PersonList';

type PersonType = 'teacher' | 'student';

export default function Directory() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedType, setSelectedType] = useState<PersonType>('teacher');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: teachers, isLoading: teachersLoading } = useGetTeachersQuery();
    const { data: students, isLoading: studentsLoading } = useGetStudentsQuery();

    const isLoading = teachersLoading || studentsLoading;

    // Extract unique grades from students
    const grades = useMemo(() => {
        if (!students) return ['All'];
        const gradeSet = new Set<string>(['All']);
        students.forEach(student => {
            if (student.grade) gradeSet.add(student.grade);
        });
        return Array.from(gradeSet).sort();
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

    const handlePress = (personId: string) => {
        if (selectedType === 'teacher') {
            router.push(`/dashboard/teacher/${personId}`);
        } else {
            router.push(`/dashboard/student/${personId}`);
        }
    };

    const handleCreatePress = () => {
        if (selectedType === 'teacher') {
            router.push('/dashboard/teacher/create');
        } else {
            router.push('/dashboard/student/create');
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <DirectoryHeader
                insets={insets}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <View className="flex-1 px-4 pt-4 z-0">
                {/* Grade Filter Pills (Students Only) */}
                {selectedType === 'student' && (
                    <View className="mb-4 pl-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                            {grades.map((grade) => (
                                <TouchableWithoutFeedback
                                    key={grade}
                                    onPress={() => setSelectedGrade(grade)}
                                >
                                    <View className={`mr-2 px-5 py-2.5 rounded-2xl border ${selectedGrade === grade
                                        ? 'bg-green-600 border-green-600 shadow-md shadow-green-500/30'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                        }`}>
                                        <Text className={`text-sm font-bold ${selectedGrade === grade ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {grade}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <PersonList
                    data={filteredPeople}
                    isLoading={isLoading}
                    selectedType={selectedType}
                    onPress={handlePress}
                    searchQuery={searchQuery}
                    selectedGrade={selectedGrade}
                />
            </View>

            {/* Floating Action Button */}
            <TouchableWithoutFeedback onPress={handleCreatePress}>
                <View
                    style={{ borderRadius: 32 }}
                    className="absolute bottom-6 right-6 w-16 h-16 items-center justify-center shadow-lg shadow-blue-600/30 z-50"
                >
                    <LinearGradient
                        colors={selectedType === 'teacher' ? ['#4F46E5', '#3730A3'] : ['#059669', '#047857']}
                        style={{ borderRadius: 32 }}
                        className="w-full h-full items-center justify-center"
                    >
                        <Ionicons name="add" size={32} color="white" />
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}
