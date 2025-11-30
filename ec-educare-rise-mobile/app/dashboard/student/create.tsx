import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateStudentMutation } from '@/services/classes.api';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { CustomAlert } from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateStudent() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [grade, setGrade] = useState('');
    const [address, setAddress] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [showGradePicker, setShowGradePicker] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const GRADES = [
        '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
        '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
        '11th Grade', '12th Grade'
    ];

    const showAlert = (title: string, message: string, type: 'success' | 'error') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const hideAlert = () => {
        setAlertConfig({ ...alertConfig, visible: false });
        if (alertConfig.type === 'success') {
            router.back();
        }
    };

    const [createStudent, { isLoading }] = useCreateStudentMutation();

    const handleCreate = async () => {
        // Validation
        if (!name.trim()) {
            showAlert('Validation Error', 'Please enter student name', 'error');
            return;
        }
        if (!grade) {
            showAlert('Validation Error', 'Please select a grade', 'error');
            return;
        }

        try {
            await createStudent({
                fullName: name,
                grade,
                mobileNumber: phone ? `+91${phone}` : undefined,
            }).unwrap();
            showAlert('Success', 'Student created successfully!', 'success');
        } catch (error: any) {
            console.error('Failed to create student:', error);
            showAlert('Error', 'Failed to create student. Please try again.', 'error');
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {isLoading && <LoadingOverlay message="Creating Student..." />}
                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={hideAlert}
                />

                {/* Gradient Header */}
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-6 px-6 rounded-b-[32px] shadow-lg z-10"
                >
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-white">Create Student</Text>
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
                            <Ionicons name="person-circle-outline" size={20} color="#10B981" />
                            <Text className="ml-2"> Student Information</Text>
                        </Text>

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name *</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-green-500"
                            placeholder="Enter student name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Email *</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-green-500"
                            placeholder="student@example.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Phone Number</Text>
                        <View className="flex-row items-center bg-gray-50 dark:bg-gray-900 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 focus:border-green-500 overflow-hidden">
                            <View className="bg-gray-100 dark:bg-gray-800 px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                                <Text className="text-gray-600 dark:text-gray-300 font-medium">+91</Text>
                            </View>
                            <TextInput
                                className="flex-1 p-4 text-gray-800 dark:text-gray-100"
                                placeholder="9876543210"
                                placeholderTextColor="#9CA3AF"
                                value={phone}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                                    setPhone(cleaned);
                                }}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Grade *</Text>
                        <TouchableOpacity
                            onPress={() => setShowGradePicker(!showGradePicker)}
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-2 flex-row justify-between items-center border border-gray-200 dark:border-gray-700"
                        >
                            <Text className={grade ? "text-gray-800 dark:text-gray-100 font-medium" : "text-gray-400"}>
                                {grade || 'Select grade'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#10B981" />
                        </TouchableOpacity>
                        {showGradePicker && (
                            <View className="bg-gray-50 dark:bg-gray-900 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ maxHeight: 200 }}>
                                <ScrollView nestedScrollEnabled={true}>
                                    {GRADES.map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            onPress={() => {
                                                setGrade(g);
                                                setShowGradePicker(false);
                                            }}
                                            className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-green-50 dark:active:bg-green-900/20"
                                        >
                                            <Text className="text-gray-800 dark:text-gray-100 font-medium">{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Address</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-green-500"
                            placeholder="Enter address"
                            placeholderTextColor="#9CA3AF"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            style={{ minHeight: 100, textAlignVertical: 'top' }}
                        />
                    </View>

                    <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex-row items-center">
                            <Ionicons name="people-circle-outline" size={20} color="#10B981" />
                            <Text className="ml-2"> Guardian Information</Text>
                        </Text>

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Guardian Name</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-green-500"
                            placeholder="Enter guardian name"
                            placeholderTextColor="#9CA3AF"
                            value={guardianName}
                            onChangeText={setGuardianName}
                        />

                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Guardian Phone</Text>
                        <TextInput
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-green-500"
                            placeholder="+1 234 567 8900"
                            placeholderTextColor="#9CA3AF"
                            value={guardianPhone}
                            onChangeText={setGuardianPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleCreate}
                        className="active:opacity-90 mb-8"
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="p-4 rounded-xl items-center justify-center shadow-lg"
                        >
                            <Text className="text-white font-bold text-lg">Create Student</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
