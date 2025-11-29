import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface PrimaryButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean;
}

export function PrimaryButton({ onPress, title, loading, disabled }: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`bg-blue-600 dark:bg-blue-500 py-3 px-6 rounded-2xl items-center justify-center ${disabled ? 'opacity-50' : 'active:bg-blue-700 dark:active:bg-blue-600'
                }`}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-lg">{title}</Text>
            )}
        </TouchableOpacity>
    );
}
