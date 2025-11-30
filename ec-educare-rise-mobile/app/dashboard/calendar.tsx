import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useGetClassesQuery } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CLASS_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
];

export default function CalendarScreen() {
    const { data: classes, isLoading } = useGetClassesQuery();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('');
    const insets = useSafeAreaInsets();

    // Assign colors to classes
    const classColors = useMemo(() => {
        if (!classes) return {};
        const colorMap: Record<string, string> = {};
        classes.forEach((cls, index) => {
            colorMap[cls.classId] = CLASS_COLORS[index % CLASS_COLORS.length];
        });
        return colorMap;
    }, [classes]);

    const markedDates = useMemo(() => {
        if (!classes) return {};

        const marks: any = {};

        // Helper to get day name
        const getDayName = (date: Date) => {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        };

        // Iterate through next 3 months to populate calendar
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
                                color: classColors[cls.classId],
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
                selectedColor: '#4F46E5', // indigo-600
            };
        }

        return marks;
    }, [classes, selectedDate, classColors]);

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

    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    if (isLoading) return <LoadingOverlay />;

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Gradient Header */}
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingTop: insets.top + 10, paddingBottom: 24 }}
                className="px-6 rounded-b-[32px] shadow-lg z-10"
            >
                <View className="flex-row items-center justify-between">
                    <Text className="text-3xl font-bold text-white">Calendar</Text>
                    <View className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                        <Ionicons name="calendar" size={24} color="white" />
                    </View>
                </View>
            </LinearGradient>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="mx-4 mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 border border-gray-100 dark:border-gray-700">
                    <Calendar
                        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        markingType={'multi-dot'}
                        theme={{
                            backgroundColor: 'transparent',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: '#6B7280',
                            selectedDayBackgroundColor: '#4F46E5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#4F46E5',
                            dayTextColor: '#1F2937',
                            textDisabledColor: '#D1D5DB',
                            dotColor: '#4F46E5',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#4F46E5',
                            monthTextColor: '#1F2937',
                            indicatorColor: '#4F46E5',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14
                        }}
                    />
                </View>

                <View className="px-6 mt-6 pb-10">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex-row items-center">
                        <Ionicons name="list" size={20} color="#4F46E5" />
                        <Text className="ml-2"> {selectedDate ? `Classes on ${formatDate(selectedDate)}` : 'Select a date'}</Text>
                    </Text>

                    {selectedDateClasses.length > 0 ? (
                        selectedDateClasses.map((cls) => (
                            <TouchableOpacity
                                key={cls.classId}
                                onPress={() => router.push(`/dashboard/class-details?id=${cls.classId}`)}
                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
                                style={{ borderLeftWidth: 4, borderLeftColor: classColors[cls.classId] }}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{cls.name}</Text>
                                        <Text className="text-gray-500 dark:text-gray-400 font-medium">{cls.subject}</Text>
                                    </View>
                                    <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                                        <Text className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
                                            {cls.standard}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <Ionicons name="time-outline" size={18} color="#6B7280" />
                                    <Text className="text-gray-500 dark:text-gray-400 ml-2 text-sm font-medium">
                                        {cls.sessionTime ? `${Math.floor(cls.sessionTime.totalHours || 0)}h ${Math.floor((cls.sessionTime.totalMinutes || 0) % 60)}m duration` : 'Time N/A'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        selectedDate ? (
                            <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 dark:text-gray-400 mt-4 font-medium">No classes scheduled for this day.</Text>
                            </View>
                        ) : (
                            <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <Ionicons name="finger-print-outline" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Tap a date to view scheduled classes.</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
