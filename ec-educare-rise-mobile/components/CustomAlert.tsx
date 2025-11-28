import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    type?: 'error' | 'success' | 'info';
}

export const CustomAlert = ({ visible, title, message, onClose, type = 'error' }: CustomAlertProps) => {
    const getIconName = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'info': return 'information-circle';
            default: return 'alert-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#16A34A'; // green-600
            case 'info': return '#2563EB'; // blue-600
            default: return '#DC2626'; // red-600
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm items-center shadow-lg">
                    <Ionicons name={getIconName()} size={48} color={getColor()} />
                    <Text className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">{title}</Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 mb-6">{message}</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-blue-600 dark:bg-blue-500 w-full py-3 rounded-xl active:bg-blue-700 dark:active:bg-blue-600"
                    >
                        <Text className="text-white text-center font-semibold text-lg">OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
