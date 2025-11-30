import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateClassMutation, useGetTeachersQuery, useGetStudentsQuery } from '@/services/classes.api';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { CustomAlert } from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const GRADES = [
    '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
    '11th Grade', '12th Grade'
];

export default function CreateClass() {
    const router = useRouter();
    const [createClass, { isLoading }] = useCreateClassMutation();

    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [standard, setStandard] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 3)));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showGradePicker, setShowGradePicker] = useState(false);
    // Duration
    const [durationHours, setDurationHours] = useState('1');
    const [durationMinutes, setDurationMinutes] = useState('0');

    // Days of week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'error' as 'error' | 'success' | 'info'
    });

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (alertConfig.type === 'success') {
            router.back();
        }
    };

    const handleCreate = async () => {
        if (!name || !subject || !standard || selectedDays.length === 0) {
            showAlert('Error', 'Please fill in all required fields and select at least one day.');
            return;
        }

        try {
            const sessionTime = {
                totalHours: parseInt(durationHours) + (parseInt(durationMinutes) / 60),
                totalMinutes: (parseInt(durationHours) * 60) + parseInt(durationMinutes)
            };

            await createClass({
                name,
                subject,
                standard,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                dayOfWeek: selectedDays,
                sessionTime
            }).unwrap();

            showAlert('Success', 'Class created successfully!', 'success');
        } catch (error: any) {
            showAlert('Error', 'Failed to create class. Please try again.');
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {isLoading && <LoadingOverlay message="Creating Class..." />}

                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={hideAlert}
                />

                {/* Gradient Header */}
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-6 px-6 rounded-b-[32px] shadow-lg z-10"
                >
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-white">Create Class</Text>
                    </View>
                </LinearGradient>

                <ScrollView
                    className="flex-1 px-4 pt-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex-row items-center">
                            <Ionicons name="information-circle-outline" size={20} color="#4F46E5" />
                            <Text className="ml-2"> Basic Info</Text>
                        </Text>

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Class Name</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-blue-500"
                            placeholder="e.g. Mathematics 101"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Subject</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-blue-500"
                            placeholder="e.g. Mathematics"
                            placeholderTextColor="#9CA3AF"
                            value={subject}
                            onChangeText={setSubject}
                        />

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Standard/Grade</Text>
                        <TouchableOpacity
                            onPress={() => setShowGradePicker(!showGradePicker)}
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-2 flex-row justify-between items-center border border-gray-200 dark:border-gray-700"
                        >
                            <Text className={standard ? "text-gray-800 dark:text-gray-100 font-medium" : "text-gray-400"}>
                                {standard || 'Select grade'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        {showGradePicker && (
                            <View className="bg-gray-50 dark:bg-gray-900 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ maxHeight: 200 }}>
                                <ScrollView nestedScrollEnabled={true}>
                                    {GRADES.map((grade) => (
                                        <TouchableOpacity
                                            key={grade}
                                            onPress={() => {
                                                setStandard(grade);
                                                setShowGradePicker(false);
                                            }}
                                            className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-blue-50 dark:active:bg-blue-900/20"
                                        >
                                            <Text className="text-gray-800 dark:text-gray-100 font-medium">{grade}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex-row items-center">
                            <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
                            <Text className="ml-2"> Schedule</Text>
                        </Text>

                        <View className="flex-row space-x-4 mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Start Date</Text>
                                <TouchableOpacity
                                    onPress={() => setShowStartPicker(true)}
                                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex-row justify-between items-center border border-gray-200 dark:border-gray-700"
                                >
                                    <Text className="text-gray-800 dark:text-gray-100 font-medium">{formatDate(startDate)}</Text>
                                    <Ionicons name="calendar" size={18} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">End Date</Text>
                                <TouchableOpacity
                                    onPress={() => setShowEndPicker(true)}
                                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex-row justify-between items-center border border-gray-200 dark:border-gray-700"
                                >
                                    <Text className="text-gray-800 dark:text-gray-100 font-medium">{formatDate(endDate)}</Text>
                                    <Ionicons name="calendar" size={18} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(Platform.OS === 'ios');
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}

                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(Platform.OS === 'ios');
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Session Duration</Text>
                        <View className="flex-row items-center mb-6">
                            <View className="flex-1 mr-2">
                                <TextInput
                                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 text-center font-bold text-lg"
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                    value={durationHours}
                                    onChangeText={setDurationHours}
                                    keyboardType="numeric"
                                />
                                <Text className="text-center text-xs text-gray-500 mt-1">Hours</Text>
                            </View>
                            <Text className="text-gray-400 font-bold text-xl mb-4">:</Text>
                            <View className="flex-1 ml-2">
                                <TextInput
                                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 text-center font-bold text-lg"
                                    placeholder="00"
                                    placeholderTextColor="#9CA3AF"
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    keyboardType="numeric"
                                />
                                <Text className="text-center text-xs text-gray-500 mt-1">Minutes</Text>
                            </View>
                        </View>

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">Days of Week</Text>
                        <View className="flex-row flex-wrap">
                            {days.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${selectedDays.includes(day)
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <Text
                                        className={`font-medium ${selectedDays.includes(day)
                                            ? 'text-white'
                                            : 'text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {day.slice(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleCreate}
                        className="active:opacity-90 mb-8"
                    >
                        <LinearGradient
                            colors={['#4F46E5', '#3730A3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="p-4 rounded-2xl items-center justify-center shadow-lg"
                        >
                            <Text className="text-white font-bold text-lg">Create Class</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
