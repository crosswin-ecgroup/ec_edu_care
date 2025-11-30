import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EdgeInsets } from 'react-native-safe-area-context';

type PersonType = 'teacher' | 'student';

interface DirectoryHeaderProps {
    insets: EdgeInsets;
    selectedType: PersonType;
    setSelectedType: (type: PersonType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function DirectoryHeader({
    insets,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery
}: DirectoryHeaderProps) {
    return (
        <LinearGradient
            colors={['#4F46E5', '#3730A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: insets.top + 10, paddingBottom: 24 }}
            className="px-6 rounded-b-[32px] shadow-lg z-50"
        >
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-bold text-white">
                    Directory
                </Text>
                <View className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <Ionicons name="people" size={24} color="white" />
                </View>
            </View>

            {/* Search Bar */}
            <View className="bg-white/20 p-1 rounded-2xl flex-row items-center border border-white/30 backdrop-blur-md overflow-hidden mb-6 z-50">
                <View className="p-3">
                    <Ionicons name="search" size={20} color="white" />
                </View>
                <TextInput
                    className="flex-1 ml-1 text-white placeholder:text-blue-100 text-base font-medium"
                    placeholder={`Search ${selectedType}s...`}
                    placeholderTextColor="rgba(219, 234, 254, 0.7)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableWithoutFeedback onPress={() => setSearchQuery('')}>
                        <View className="p-3">
                            <Ionicons name="close-circle" size={20} color="white" />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>

            {/* Integrated Tabs */}
            <View className="bg-white/10 p-1 rounded-2xl flex-row backdrop-blur-md border border-white/20 z-50">
                <TouchableWithoutFeedback onPress={() => setSelectedType('teacher')}>
                    <View className={`flex-1 py-2.5 rounded-xl items-center justify-center ${selectedType === 'teacher' ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                        <Text className={`font-bold text-base ${selectedType === 'teacher' ? 'text-blue-600' : 'text-blue-100'}`}>
                            Teachers
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setSelectedType('student')}>
                    <View className={`flex-1 py-2.5 rounded-xl items-center justify-center ${selectedType === 'student' ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                        <Text className={`font-bold text-base ${selectedType === 'student' ? 'text-blue-600' : 'text-blue-100'}`}>
                            Students
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </LinearGradient>
    );
}
