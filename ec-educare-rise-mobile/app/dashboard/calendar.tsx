import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
    const { data: classes, isLoading } = useGetClassesQuery();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('');

    const markedDates = useMemo(() => {
        if (!classes) return {};

        const marks: any = {};
        const today = new Date();

        // Helper to get day name
        const getDayName = (date: Date) => {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        };

        // Iterate through next 3 months to populate calendar
        // This is a simplified approach. Ideally, we'd generate on demand or have backend support.
        const startDate = new Date();
        startDate.setDate(1); // Start of current month
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // 3 months ahead

        classes.forEach((cls) => {
            if (!cls.dayOfWeek || !cls.startDate || !cls.endDate) return;

            const classStart = new Date(cls.startDate);
            const classEnd = new Date(cls.endDate);

            let current = new Date(startDate);
            while (current <= endDate) {
                if (current >= classStart && current <= classEnd) {
                    const dayName = getDayName(current);
                    if (cls.dayOfWeek.includes(dayName)) {
                        const dateStr = current.toISOString().split('T')[0];
                        if (!marks[dateStr]) {
                            marks[dateStr] = { dots: [] };
                        }
                        // Add dot if not already present for this class
                        if (!marks[dateStr].dots.find((d: any) => d.key === cls.classId)) {
                            marks[dateStr].dots.push({
                                key: cls.classId,
                                color: '#10B981', // emerald-500 (Green for timing range)
                                selectedDotColor: 'white',
                            });
                        }
                    }
                }
                current.setDate(current.getDate() + 1);
            }
        });

        // Mark selected date
        if (selectedDate) {
            marks[selectedDate] = {
                ...marks[selectedDate],
                selected: true,
                selectedColor: '#2563EB', // blue-600
            };
        }

        return marks;
    }, [classes, selectedDate]);

    const selectedDateClasses = useMemo(() => {
        if (!classes || !selectedDate) return [];

        const date = new Date(selectedDate);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        return classes.filter(cls => {
            if (!cls.dayOfWeek || !cls.startDate || !cls.endDate) return false;
            const start = new Date(cls.startDate);
            const end = new Date(cls.endDate);
            return date >= start && date <= end && cls.dayOfWeek.includes(dayName);
        });
    }, [classes, selectedDate]);

    if (isLoading) return <LoadingOverlay />;

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <Calendar
                onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                markingType={'multi-dot'}
                theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#6B7280',
                    selectedDayBackgroundColor: '#2563EB',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#2563EB',
                    dayTextColor: '#1F2937',
                    textDisabledColor: '#D1D5DB',
                    dotColor: '#3B82F6',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#2563EB',
                    monthTextColor: '#1F2937',
                    indicatorColor: '#2563EB',
                    textDayFontWeight: '400',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '400',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14
                }}
                style={{
                    borderRadius: 12,
                    margin: 16,
                    paddingBottom: 10,
                    backgroundColor: 'white', // Or dark mode color, handled via wrapper usually but Calendar theme is object
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                }}
            />

            <View className="flex-1 px-4">
                <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {selectedDate ? `Classes on ${selectedDate}` : 'Select a date to view classes'}
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {selectedDateClasses.length > 0 ? (
                        selectedDateClasses.map((cls) => (
                            <TouchableOpacity
                                key={cls.classId}
                                onPress={() => router.push(`/dashboard/class-details?id=${cls.classId}`)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 border-l-4 border-blue-500"
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">{cls.name}</Text>
                                        <Text className="text-gray-600 dark:text-gray-400">{cls.subject}</Text>
                                    </View>
                                    <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                        <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                                            {cls.standard}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center mt-3">
                                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                                    <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                                        {/* Placeholder for time, as sessionTime is duration not start time */}
                                        {cls.sessionTime ? `${Math.floor(cls.sessionTime.totalHours || 0)}h ${Math.floor((cls.sessionTime.totalMinutes || 0) % 60)}m duration` : 'Time N/A'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        selectedDate ? (
                            <View className="items-center py-8">
                                <Text className="text-gray-500 dark:text-gray-400">No classes scheduled for this day.</Text>
                            </View>
                        ) : null
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
