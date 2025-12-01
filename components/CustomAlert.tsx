import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    type?: 'error' | 'success' | 'info' | 'warning';
    onConfirm?: () => void;
    showCancel?: boolean;
}

export const CustomAlert = ({ visible, title, message, onClose, type = 'error', onConfirm, showCancel = false }: CustomAlertProps) => {
    const getIconName = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'info': return 'information-circle';
            case 'warning': return 'alert-circle';
            default: return 'alert-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#16A34A'; // green-600
            case 'info': return '#2563EB'; // blue-600
            case 'warning': return '#F59E0B'; // amber-500
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

                    <View className="flex-row w-full space-x-3">
                        {showCancel && (
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-xl active:bg-gray-200 dark:active:bg-gray-600 mr-2"
                            >
                                <Text className="text-gray-700 dark:text-gray-300 text-center font-semibold text-lg">Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => {
                                if (onConfirm) {
                                    onConfirm();
                                } else {
                                    onClose();
                                }
                            }}
                            className={`flex-1 py-3 rounded-xl active:opacity-90 ${type === 'warning' ? 'bg-amber-500' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
                        >
                            <Text className="text-white text-center font-semibold text-lg">{onConfirm ? 'Confirm' : 'OK'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
