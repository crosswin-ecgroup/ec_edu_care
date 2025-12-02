import { DirectoryHeader } from '@/components/directory/DirectoryHeader';
import { PersonList } from '@/components/directory/PersonList';
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';
import { useGetStudentsQuery } from '@/services/students.api';
import { useGetTeachersQuery } from '@/services/teachers.api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PersonType = 'teacher' | 'student';

export default function Directory() {
    // All hooks must be called unconditionally at the top
    const insets = useSafeAreaInsets();
    const [selectedType, setSelectedType] = useState<PersonType>('teacher');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { data: teachers, isLoading: teachersLoading } = useGetTeachersQuery();
    const { data: students, isLoading: studentsLoading } = useGetStudentsQuery();

    // Safely get router - if not available during dev fast refresh, return null
    let router;
    try {
        router = useRouter();
    } catch (error) {
        // Navigation context not ready yet (dev only)
        return null;
    }

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

    // Filter data based on search and filters
    const filteredData = useMemo(() => {
        const data = selectedType === 'teacher' ? teachers : students;
        if (!data) return [];

        return data.filter(person => {
            const matchesSearch = person.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (selectedType === 'teacher' && (person as any).email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (selectedType === 'student' && (person as any).grade?.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesGrade = selectedType === 'teacher' ||
                selectedGrade === 'All' ||
                (person as any).grade === selectedGrade;

            return matchesSearch && matchesGrade;
        });
    }, [selectedType, teachers, students, searchQuery, selectedGrade]);

    const handlePersonPress = (personId: string) => {
        if (!router) return;
        if (selectedType === 'teacher') {
            router.push(`/teacher/${personId}` as any);
        } else {
            router.push(`/student/${personId}` as any);
        }
    };

    const handleCreatePress = () => {
        if (!router) return;
        if (selectedType === 'teacher') {
            router.push('/teacher/create' as any);
        } else {
            router.push('/student/create' as any);
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

                {isLoading ? (
                    <ListSkeleton />
                ) : (
                    <PersonList
                        data={filteredData}
                        isLoading={false}
                        selectedType={selectedType}
                        onPress={handlePersonPress}
                        searchQuery={searchQuery}
                        selectedGrade={selectedGrade}
                    />
                )}
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
