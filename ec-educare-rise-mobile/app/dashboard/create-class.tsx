import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateClassMutation } from '../../services/classes.api';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomAlert } from '../../components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
            {isLoading && <LoadingOverlay message="Creating Class..." />}

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={hideAlert}
            />

            <View className="bg-white dark:bg-gray-800 p-4 shadow-sm flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#3B82F6" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 dark:text-gray-100">Create Class</Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Basic Info</Text>

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Class Name</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="e.g. Mathematics 101"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Subject</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="e.g. Mathematics"
                        placeholderTextColor="#9CA3AF"
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Standard/Grade</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="e.g. 10th Grade"
                        placeholderTextColor="#9CA3AF"
                        value={standard}
                        onChangeText={setStandard}
                    />
                </View>

                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Schedule</Text>

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Start Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowStartPicker(true)}
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 flex-row justify-between items-center"
                    >
                        <Text className="text-gray-800 dark:text-gray-100">{formatDate(startDate)}</Text>
                        <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                    </TouchableOpacity>
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

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">End Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowEndPicker(true)}
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 flex-row justify-between items-center"
                    >
                        <Text className="text-gray-800 dark:text-gray-100">{formatDate(endDate)}</Text>
                        <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                    </TouchableOpacity>
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

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Session Duration</Text>
                    <View className="flex-row items-center mb-4">
                        <TextInput
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex-1 mr-2 text-gray-800 dark:text-gray-100"
                            placeholder="Hours"
                            placeholderTextColor="#9CA3AF"
                            value={durationHours}
                            onChangeText={setDurationHours}
                            keyboardType="numeric"
                        />
                        <Text className="text-gray-600 dark:text-gray-400 mr-4">Hrs</Text>
                        <TextInput
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex-1 mr-2 text-gray-800 dark:text-gray-100"
                            placeholder="Minutes"
                            placeholderTextColor="#9CA3AF"
                            value={durationMinutes}
                            onChangeText={setDurationMinutes}
                            keyboardType="numeric"
                        />
                        <Text className="text-gray-600 dark:text-gray-400">Mins</Text>
                    </View>

                    <Text className="text-gray-600 dark:text-gray-400 mb-2">Days of Week</Text>
                    <View className="flex-row flex-wrap">
                        {days.map((day) => (
                            <TouchableOpacity
                                key={day}
                                onPress={() => toggleDay(day)}
                                className={`mr-2 mb-2 px-3 py-2 rounded-full border ${selectedDays.includes(day)
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <Text
                                    className={`${selectedDays.includes(day)
                                            ? 'text-white font-bold'
                                            : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <PrimaryButton title="Create Class" onPress={handleCreate} />
                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
