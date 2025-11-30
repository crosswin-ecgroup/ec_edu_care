import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetTeachersQuery, useGetStudentsQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PersonType = 'teacher' | 'student';

export default function Directory() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<PersonType>('teacher');
    const { data: teachers, isLoading: teachersLoading } = useGetTeachersQuery();
    const { data: students, isLoading: studentsLoading } = useGetStudentsQuery();
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

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
            router.push(`/dashboard/teacher-details?id=${personId}`);
        } else {
            router.push(`/dashboard/student-details?id=${personId}`);
        }
    };

    const handleCreatePress = () => {
        if (selectedType === 'teacher') {
            router.push('/dashboard/create-teacher');
        } else {
            router.push('/dashboard/create-student');
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Modern Gradient Header with Tabs */}
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: insets.top + 10, paddingBottom: 24 }}
                className="px-6 rounded-b-[32px] shadow-lg z-50"
            >
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-3xl font-bold text-white">
                        Directory
                    </Text>
                    <View className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                        <Ionicons name="people" size={24} color="white" />
                    </View>
                </View>

                {/* Search Bar */}
                <View className="bg-white/20 p-1 rounded-2xl flex-row items-center border border-white/30 backdrop-blur-md overflow-hidden mb-6 z-50">
                    <View className="p-3">
                        <Ionicons name="search" size={20} color="white" />
                    </View>
                    <TextInput
                        className="flex-1 ml-1 text-white placeholder:text-blue-100 text-base font-medium"
                        placeholder={`Search ${selectedType}s...`}
                        placeholderTextColor="rgba(219, 234, 254, 0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')} className="p-3">
                            <Ionicons name="close-circle" size={20} color="white" />
                        </Pressable>
                    )}
                </View>

                {/* Integrated Tabs */}
                <View className="bg-white/10 p-1 rounded-2xl flex-row backdrop-blur-md border border-white/20 z-50">
                    <Pressable
                        onPress={() => setSelectedType('teacher')}
                        className={`flex-1 py-2.5 rounded-xl items-center justify-center ${selectedType === 'teacher' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-base ${selectedType === 'teacher' ? 'text-blue-600' : 'text-blue-100'}`}>
                            Teachers
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setSelectedType('student')}
                        className={`flex-1 py-2.5 rounded-xl items-center justify-center ${selectedType === 'student' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-base ${selectedType === 'student' ? 'text-blue-600' : 'text-blue-100'}`}>
                            Students
                        </Text>
                    </Pressable>
                </View>
            </LinearGradient>

            <View className="flex-1 px-4 pt-4 z-0">
                {/* Grade Filter Pills (Students Only) */}
                {selectedType === 'student' && (
                    <View className="mb-4 pl-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                            {grades.map((grade) => (
                                <Pressable
                                    key={grade}
                                    onPress={() => setSelectedGrade(grade)}
                                    className={`mr-2 px-5 py-2.5 rounded-2xl border ${selectedGrade === grade
                                        ? 'bg-green-600 border-green-600 shadow-md shadow-green-500/30'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                        }`}
                                >
                                    <Text className={`text-sm font-bold ${selectedGrade === grade ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {grade}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Content List */}
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Count Header */}
                    <View className="flex-row items-center justify-between mb-4 px-2">
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">
                            {filteredPeople.length} {filteredPeople.length === 1 ? 'Result' : 'Results'}
                        </Text>
                        <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700 ml-4" />
                    </View>

                    {isLoading ? (
                        <LoadingOverlay />
                    ) : filteredPeople.length > 0 ? (
                        filteredPeople.map((person: any) => {
                            const personId = selectedType === 'teacher' ? person.teacherId : person.studentId;
                            const grade = selectedType === 'student' ? person.grade : null;

                            return (
                                <Pressable
                                    key={personId}
                                    onPress={() => handlePress(personId)}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 flex-row items-center active:scale-[0.98] transition-all"
                                >
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
                                </Pressable>
                            );
                        })
                    ) : (
                        <View className="items-center py-12 opacity-70">
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
                </ScrollView>
            </View>

            {/* Floating Action Button */}
            <Pressable
                onPress={handleCreatePress}
                style={{ borderRadius: 32 }}
                className="absolute bottom-6 right-6 w-16 h-16 items-center justify-center shadow-lg shadow-blue-600/30 active:scale-90 transition-all z-50"
            >
                <LinearGradient
                    colors={selectedType === 'teacher' ? ['#4F46E5', '#3730A3'] : ['#059669', '#047857']}
                    style={{ borderRadius: 32 }}
                    className="w-full h-full items-center justify-center"
                >
                    <Ionicons name="add" size={32} color="white" />
                </LinearGradient>
            </Pressable>
        </View>
    );
}
