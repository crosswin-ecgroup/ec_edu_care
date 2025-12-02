import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditScheduleModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData: {
        startDate: string;
        endDate: string;
        dayOfWeek: string[];
        sessionTime: any;
        sessionDurationMinutes?: number;
    };
    isLoading?: boolean;
}

const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const EditScheduleModal = ({ visible, onClose, onSave, initialData, isLoading }: EditScheduleModalProps) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState(new Date());
    const [duration, setDuration] = useState('60');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (visible && initialData) {
            if (initialData.startDate) setStartDate(new Date(initialData.startDate));
            if (initialData.endDate) setEndDate(new Date(initialData.endDate));
            if (initialData.dayOfWeek) setSelectedDays(initialData.dayOfWeek);

            // Handle session time
            if (initialData.sessionTime) {
                const now = new Date();
                // Assuming sessionTime comes as TimeSpan with hours/minutes
                const hours = initialData.sessionTime.hours || 0;
                const minutes = initialData.sessionTime.minutes || 0;
                now.setHours(hours, minutes, 0, 0);
                setStartTime(now);
            }

            if (initialData.sessionDurationMinutes) {
                setDuration(initialData.sessionDurationMinutes.toString());
            }
        }
    }, [visible, initialData]);

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSave = () => {
        const hours = startTime.getHours().toString().padStart(2, '0');
        const minutes = startTime.getMinutes().toString().padStart(2, '0');
        const sessionTime = `${hours}:${minutes}:00`;

        const data = {
            newStartDate: startDate.toISOString(),
            newEndDate: endDate.toISOString(),
            dayOfWeek: selectedDays,
            sessionTime: sessionTime,
            sessionDurationMinutes: parseInt(duration) || 60
        };

        onSave(data);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-gray-800 rounded-t-3xl h-[85%]">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Schedule</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {/* Start Date */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Start Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowStartDatePicker(true)}
                                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex-row justify-between items-center"
                            >
                                <Text className="text-gray-900 dark:text-gray-100">{formatDate(startDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowStartDatePicker(Platform.OS === 'ios');
                                        if (date) setStartDate(date);
                                    }}
                                />
                            )}
                        </View>

                        {/* End Date */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">End Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowEndDatePicker(true)}
                                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex-row justify-between items-center"
                            >
                                <Text className="text-gray-900 dark:text-gray-100">{formatDate(endDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowEndDatePicker(Platform.OS === 'ios');
                                        if (date) setEndDate(date);
                                    }}
                                />
                            )}
                        </View>

                        {/* Session Time */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Session Time</Text>
                            <TouchableOpacity
                                onPress={() => setShowTimePicker(true)}
                                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex-row justify-between items-center"
                            >
                                <Text className="text-gray-900 dark:text-gray-100">{formatTime(startTime)}</Text>
                                <Ionicons name="time-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={startTime}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowTimePicker(Platform.OS === 'ios');
                                        if (date) setStartTime(date);
                                    }}
                                />
                            )}
                        </View>

                        {/* Duration */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Duration (minutes)</Text>
                            <TextInput
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                placeholder="60"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Days of Week */}
                        <View className="mb-8">
                            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Days of Week</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {DAYS_OF_WEEK.map((day) => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => toggleDay(day)}
                                        className={`px-4 py-2 rounded-full border ${selectedDays.includes(day)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                            }`}
                                    >
                                        <Text
                                            className={`${selectedDays.includes(day)
                                                ? 'text-white font-bold'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {day.slice(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <View className="p-6 border-t border-gray-100 dark:border-gray-700">
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl flex-row justify-center items-center ${isLoading ? 'bg-blue-400' : 'bg-blue-600'
                                }`}
                        >
                            {isLoading ? (
                                <Text className="text-white font-bold text-lg">Saving...</Text>
                            ) : (
                                <Text className="text-white font-bold text-lg">Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
