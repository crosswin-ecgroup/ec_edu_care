import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomAlert } from '../../components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';

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

    const handleCreate = async () => {
        // Validation
        if (!name.trim()) {
            showAlert('Validation Error', 'Please enter student name', 'error');
            return;
        }
        if (!email.trim()) {
            showAlert('Validation Error', 'Please enter student email', 'error');
            return;
        }
        if (!grade) {
            showAlert('Validation Error', 'Please select a grade', 'error');
            return;
        }

        // TODO: Implement API call to create student
        // For now, just show success
        showAlert('Success', 'Student created successfully!', 'success');
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50 dark:bg-gray-900"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={hideAlert}
            />

            <ScrollView
                className="flex-1 p-4"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Student Information</Text>

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Full Name *</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="Enter student name"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Email *</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="student@example.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Phone Number</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="+1 234 567 8900"
                        placeholderTextColor="#9CA3AF"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Grade *</Text>
                    <TouchableOpacity
                        onPress={() => setShowGradePicker(!showGradePicker)}
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-2 flex-row justify-between items-center"
                    >
                        <Text className={grade ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}>
                            {grade || 'Select grade'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                    {showGradePicker && (
                        <View className="bg-gray-100 dark:bg-gray-700 rounded-lg mb-4" style={{ maxHeight: 200 }}>
                            <ScrollView nestedScrollEnabled={true}>
                                {GRADES.map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        onPress={() => {
                                            setGrade(g);
                                            setShowGradePicker(false);
                                        }}
                                        className="p-3 border-b border-gray-200 dark:border-gray-600"
                                    >
                                        <Text className="text-gray-800 dark:text-gray-100">{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Address</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="Enter address"
                        placeholderTextColor="#9CA3AF"
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Guardian Information</Text>

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Guardian Name</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="Enter guardian name"
                        placeholderTextColor="#9CA3AF"
                        value={guardianName}
                        onChangeText={setGuardianName}
                    />

                    <Text className="text-gray-600 dark:text-gray-400 mb-1">Guardian Phone</Text>
                    <TextInput
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-gray-800 dark:text-gray-100"
                        placeholder="+1 234 567 8900"
                        placeholderTextColor="#9CA3AF"
                        value={guardianPhone}
                        onChangeText={setGuardianPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                <PrimaryButton title="Create Student" onPress={handleCreate} />
                <View className="h-8" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
