import React from 'react';
import { View, Text } from 'react-native';

interface AuthCardProps {
    title: string;
    children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
    return (
        <View className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
            <Text className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</Text>
            {children}
        </View>
    );
}
