import { CustomAlert } from '@/components/CustomAlert';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useGetClassByIdQuery } from '@/services/classes.api';
import {
    useGetSessionAttendanceQuery,
    useGetSessionsQuery,
    useMarkAttendanceMutation
} from '@/services/sessions.api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SessionDetails() {
    const { id, sessionId } = useLocalSearchParams<{ id: string; sessionId: string }>();
    const router = useRouter();

    const { data: classData } = useGetClassByIdQuery(id || '');
    const { data: sessions } = useGetSessionsQuery(id || '');
    const { data: attendanceData, isLoading: isLoadingAttendance, refetch } = useGetSessionAttendanceQuery({
        classId: id || '',
        sessionId: sessionId || ''
    });

    const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'error' as 'error' | 'success' | 'info'
    });

    const session = sessions?.find(s => s.classSessionId === sessionId);

    if (isLoadingAttendance || !classData || !session) {
        return <LoadingOverlay />;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const handleMarkAttendance = async (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
        try {
            await markAttendance({
                classId: id!,
                sessionId: sessionId!,
                body: { studentId, status }
            }).unwrap();
            // Optimistic update or refetch is handled by tags, but we can show feedback
        } catch (error) {
            setAlertConfig({ visible: true, title: 'Error', message: 'Failed to mark attendance', type: 'error' });
        }
    };

    const getStudentStatus = (studentId: string) => {
        const record = attendanceData?.find(a => a.studentId === studentId);
        return record?.status;
    };

    const StatusButton = ({ studentId, status, currentStatus, color, icon }: any) => {
        const isSelected = currentStatus === status;
        return (
            <TouchableOpacity
                onPress={() => handleMarkAttendance(studentId, status)}
                className={`p-2 rounded-lg mx-1 ${isSelected ? `bg-${color}-100 dark:bg-${color}-900/50 border border-${color}-500` : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={isSelected ? (status === 'Present' ? '#10B981' : status === 'Absent' ? '#EF4444' : '#F59E0B') : '#9CA3AF'}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
            <ScrollView className="flex-1">
                {/* Header */}
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-8 px-6 rounded-b-[32px] shadow-lg"
                >
                    <TouchableOpacity onPress={() => router.back()} className="mb-6 self-start bg-white/20 p-2 rounded-full">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-white mb-2">
                        {session.title || 'Session Details'}
                    </Text>
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={18} color="#E0E7FF" />
                        <Text className="text-blue-100 ml-2 font-medium">
                            {formatDate(session.scheduledDateTime)} • {formatTime(session.scheduledDateTime)}
                        </Text>
                    </View>
                </LinearGradient>

                <View className="px-6 -mt-6">
                    {/* Stats Summary */}
                    <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 flex-row justify-between">
                        <View className="items-center flex-1 border-r border-gray-100 dark:border-gray-700">
                            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {attendanceData?.filter(a => a.status === 'Present').length || 0}
                            </Text>
                            <Text className="text-xs text-gray-500 uppercase font-medium">Present</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-gray-100 dark:border-gray-700">
                            <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {attendanceData?.filter(a => a.status === 'Absent').length || 0}
                            </Text>
                            <Text className="text-xs text-gray-500 uppercase font-medium">Absent</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {classData.students?.length || 0}
                            </Text>
                            <Text className="text-xs text-gray-500 uppercase font-medium">Total</Text>
                        </View>
                    </View>

                    {/* Legend */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-6 border border-blue-100 dark:border-blue-800">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="information-circle" size={18} color="#3B82F6" />
                            <Text className="text-blue-700 dark:text-blue-300 font-bold ml-2">Status Legend</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg border border-green-500 mr-2">
                                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                </View>
                                <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">Present</Text>
                            </View>
                            <View className="flex-row items-center flex-1">
                                <View className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg border border-red-500 mr-2">
                                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                                </View>
                                <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">Absent</Text>
                            </View>
                            <View className="flex-row items-center flex-1">
                                <View className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-lg border border-yellow-500 mr-2">
                                    <Ionicons name="time" size={18} color="#F59E0B" />
                                </View>
                                <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">Late</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mb-4 px-2">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            Mark Attendance
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Tap icons to update student status
                        </Text>
                    </View>

                    {classData.students && classData.students.length > 0 ? (
                        classData.students.map((student: any) => {
                            const currentStatus = getStudentStatus(student.studentId);
                            return (
                                <View key={student.studentId} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700 flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 mr-2">
                                        <View className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center mr-3">
                                            <Text className="text-indigo-600 dark:text-indigo-400 font-bold">
                                                {(student.fullName || student.name || 'S')[0].toUpperCase()}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-800 dark:text-gray-100 font-bold text-base" numberOfLines={1}>
                                                {student.fullName || student.name}
                                            </Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                                {student.studentId.slice(0, 8)}...
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row">
                                        <StatusButton
                                            studentId={student.studentId}
                                            status="Present"
                                            currentStatus={currentStatus}
                                            color="green"
                                            icon="checkmark-circle"
                                        />
                                        <StatusButton
                                            studentId={student.studentId}
                                            status="Absent"
                                            currentStatus={currentStatus}
                                            color="red"
                                            icon="close-circle"
                                        />
                                        <StatusButton
                                            studentId={student.studentId}
                                            status="Late"
                                            currentStatus={currentStatus}
                                            color="yellow"
                                            icon="time"
                                        />
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View className="items-center py-12 opacity-50">
                            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                                No students in this class
                            </Text>
                        </View>
                    )}
                </View>
                <View className="h-10" />
            </ScrollView>
            {isMarking && <LoadingOverlay />}
        </View>
    );
}
