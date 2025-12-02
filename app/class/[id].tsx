import { ClassHeader } from '@/components/class/ClassHeader';
import { ClassSchedule } from '@/components/class/ClassSchedule';
import { ClassStats } from '@/components/class/ClassStats';
import { MaterialList } from '@/components/class/MaterialList';
import { StudentList } from '@/components/class/StudentList';
import { StudentModal } from '@/components/class/StudentModal';
import { TeacherList } from '@/components/class/TeacherList';
import { TeacherModal } from '@/components/class/TeacherModal';
import { ClassDetailsSkeleton } from '@/components/skeletons/ClassDetailsSkeleton';
import { useAlert } from '@/context/AlertContext';
import {
    useAddStudentToClassMutation,
    useAssignTeacherMutation,
    useGetClassByIdQuery,
    useGetMaterialsQuery,
    useRemoveStudentFromClassMutation,
    useRemoveTeacherFromClassMutation,
} from '@/services/classes.api';
import { useLazyGetStudentsQuery } from '@/services/students.api';
import { useLazyGetTeachersQuery } from '@/services/teachers.api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClassDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();

    // Queries
    const { data: classData, isLoading } = useGetClassByIdQuery(id || '');
    const [getTeachers, { data: allTeachers }] = useLazyGetTeachersQuery();
    const [getStudents, { data: allStudents }] = useLazyGetStudentsQuery();
    const { data: materials } = useGetMaterialsQuery(id || '');

    // Mutations
    const [assignTeacher, { isLoading: isAssigningTeacher }] = useAssignTeacherMutation();
    const [addStudent, { isLoading: isAddingStudent }] = useAddStudentToClassMutation();
    const [removeTeacher, { isLoading: isRemovingTeacher }] = useRemoveTeacherFromClassMutation();
    const [removeStudent, { isLoading: isRemovingStudent }] = useRemoveStudentFromClassMutation();

    // State
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [teacherSearch, setTeacherSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');

    // Effects for lazy loading
    React.useEffect(() => {
        if (showTeacherModal) {
            getTeachers();
        }
    }, [showTeacherModal]);

    React.useEffect(() => {
        if (showStudentModal) {
            getStudents();
        }
    }, [showStudentModal]);

    if (isLoading) {
        return <ClassDetailsSkeleton />;
    }

    if (!classData) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Class not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleAssignTeacher = async (teacherId: string) => {
        try {
            await assignTeacher({ classId: id!, teacherId }).unwrap();
            setShowTeacherModal(false);
            setTeacherSearch('');
            showAlert({
                title: 'Success',
                message: 'Teacher assigned successfully',
                type: 'success'
            });
        } catch (error) {
            showAlert({
                title: 'Error',
                message: 'Failed to assign teacher',
                type: 'error'
            });
        }
    };

    const handleAddStudent = async (studentId: string) => {
        try {
            await addStudent({ classId: id!, studentId }).unwrap();
            setShowStudentModal(false);
            setStudentSearch('');
            showAlert({
                title: 'Success',
                message: 'Student added successfully',
                type: 'success'
            });
        } catch (error) {
            showAlert({
                title: 'Error',
                message: 'Failed to add student',
                type: 'error'
            });
        }
    };

    const handleRemoveTeacher = (teacherId: string) => {
        showAlert({
            title: 'Remove Teacher',
            message: 'Are you sure you want to remove this teacher from the class?',
            type: 'warning',
            showCancel: true,
            onConfirm: async () => {
                try {
                    await removeTeacher({ classId: id!, teacherId }).unwrap();
                    showAlert({
                        title: 'Success',
                        message: 'Teacher removed successfully',
                        type: 'success'
                    });
                } catch (error) {
                    showAlert({
                        title: 'Error',
                        message: 'Failed to remove teacher',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleRemoveStudent = (studentId: string) => {
        showAlert({
            title: 'Remove Student',
            message: 'Are you sure you want to remove this student from the class?',
            type: 'warning',
            showCancel: true,
            onConfirm: async () => {
                try {
                    await removeStudent({ classId: id!, studentId }).unwrap();
                    showAlert({
                        title: 'Success',
                        message: 'Student removed successfully',
                        type: 'success'
                    });
                } catch (error) {
                    showAlert({
                        title: 'Error',
                        message: 'Failed to remove student',
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredTeachers = allTeachers?.filter(t =>
        !classData.teachers?.some(ct => ct.teacherId === t.teacherId) &&
        (t.fullName?.toLowerCase().includes(teacherSearch.toLowerCase()) ||
            t.email?.toLowerCase().includes(teacherSearch.toLowerCase()))
    ) || [];

    const filteredStudents = allStudents?.filter(s =>
        !classData.students?.some(cs => cs.studentId === s.studentId) &&
        (s.fullName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.grade?.toLowerCase().includes(studentSearch.toLowerCase()))
    ) || [];

    const teacherCount = classData.teachers?.length || 0;
    const studentCount = classData.students?.length || 0;

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1">
                <ClassHeader
                    name={classData.name || ''}
                    subject={classData.subject || ''}
                    standard={classData.standard}
                />

                <View className="px-6 -mt-12">
                    <ClassStats
                        teacherCount={teacherCount}
                        studentCount={studentCount}
                    />

                    <TouchableOpacity
                        onPress={() => router.push(`/class/${id}/sessions`)}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 flex-row items-center justify-between active:bg-gray-50 dark:active:bg-gray-700"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-xl mr-3">
                                <Ionicons name="list" size={20} color="#4F46E5" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                Class Sessions
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity >

                    <ClassSchedule
                        classId={id || ''}
                        startDate={classData?.startDate || ''}
                        endDate={classData?.endDate || ''}
                        sessionTime={classData?.sessionTime}
                        dayOfWeek={
                            Array.isArray(classData?.dayOfWeek)
                                ? classData.dayOfWeek
                                : classData?.dayOfWeek
                                    ? classData.dayOfWeek.split(',')
                                    : []
                        }
                    />

                    <MaterialList materials={materials || []} />

                    <TeacherList
                        teachers={classData.teachers || []}
                        onAddTeacher={() => setShowTeacherModal(true)}
                        onRemoveTeacher={handleRemoveTeacher}
                    />

                    <StudentList
                        students={classData.students || []}
                        onAddStudent={() => setShowStudentModal(true)}
                        onRemoveStudent={handleRemoveStudent}
                    />

                    {/* Telegram Group Button */}
                    {
                        classData.telegramGroupLink && (
                            <TouchableOpacity
                                onPress={() => classData.telegramGroupLink && Linking.openURL(classData.telegramGroupLink)}
                                className="active:opacity-90 mb-8"
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    className="p-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                                >
                                    <Ionicons name="paper-plane" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2 text-base">Join Telegram Group</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )
                    }
                </View >
            </ScrollView >

            <TeacherModal
                visible={showTeacherModal}
                onClose={() => setShowTeacherModal(false)}
                searchQuery={teacherSearch}
                onSearchChange={setTeacherSearch}
                teachers={filteredTeachers}
                onAssign={handleAssignTeacher}
                isLoading={isAssigningTeacher}
            />

            <StudentModal
                visible={showStudentModal}
                onClose={() => setShowStudentModal(false)}
                searchQuery={studentSearch}
                onSearchChange={setStudentSearch}
                students={filteredStudents}
                onAdd={handleAddStudent}
                isLoading={isAddingStudent}
            />
        </View >
    );
}

