import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
    return (
        <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
            <View className="bg-white p-6 rounded-lg items-center">
                <ActivityIndicator size="large" color="#2563EB" />
                {message && <Text className="mt-4 text-gray-700 font-medium">{message}</Text>}
            </View>
        </View>
    );
}
