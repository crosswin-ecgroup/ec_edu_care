import { useAlert } from '@/context/AlertContext';
import { useUpdateClassScheduleMutation } from '@/services/classes.api';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { EditScheduleModal } from './EditScheduleModal';

interface ClassScheduleProps {
    classId: string;
    startDate: string;
    endDate: string;
    sessionTime: any;
    dayOfWeek?: string[];
    sessionDurationMinutes?: number;
}

export const ClassSchedule = ({ classId, startDate, endDate, sessionTime, dayOfWeek, sessionDurationMinutes }: ClassScheduleProps) => {
    const colorScheme = useColorScheme();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateClassScheduleMutation();
    const { showAlert } = useAlert();

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeSpan: any) => {
        if (!timeSpan) return 'N/A';
        const hours = Math.floor(timeSpan.totalHours || 0);
        const minutes = Math.floor((timeSpan.totalMinutes || 0) % 60);
        return `${hours}h ${minutes}m`;
    };

    const handleUpdateSchedule = async (data: any) => {
        try {
            await updateSchedule({ classId, data }).unwrap();
            setIsEditModalVisible(false);
            showAlert({
                title: 'Success',
                message: 'Class schedule updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Failed to update schedule:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to update class schedule',
                type: 'error'
            });
        }
    };

    return (
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <View className="flex-row items-center">
                    <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-xl mr-3">
                        <Ionicons name="calendar" size={20} color="#8B5CF6" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Schedule
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setIsEditModalVisible(true)}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                >
                    <Ionicons name="pencil" size={18} color={colorScheme === 'dark' ? '#D1D5DB' : '#6B7280'} />
                </TouchableOpacity>
            </View>

            <View>
                <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <View className="w-24">
                        <Text className="text-xs font-medium text-gray-400 uppercase">Start Date</Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatDate(startDate)}</Text>
                </View>

                <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <View className="w-24">
                        <Text className="text-xs font-medium text-gray-400 uppercase">End Date</Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatDate(endDate)}</Text>
                </View>

                <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <View className="w-24">
                        <Text className="text-xs font-medium text-gray-400 uppercase">Duration</Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">{formatTime(sessionTime)}</Text>
                </View>

                {dayOfWeek && dayOfWeek.length > 0 && (
                    <View className="flex-row items-start py-3">
                        <View className="w-24 pt-1">
                            <Text className="text-xs font-medium text-gray-400 uppercase">Days</Text>
                        </View>
                        <View className="flex-1 flex-row flex-wrap">
                            {dayOfWeek.map((day: string, index: number) => (
                                <View key={index} className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg mr-2 mb-2 border border-blue-100 dark:border-blue-800">
                                    <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
                                        {day.slice(0, 3)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            <EditScheduleModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSave={handleUpdateSchedule}
                initialData={{
                    startDate,
                    endDate,
                    dayOfWeek: dayOfWeek || [],
                    sessionTime,
                    sessionDurationMinutes
                }}
                isLoading={isUpdating}
            />
        </View>
    );
};
