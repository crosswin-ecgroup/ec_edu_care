import { Material } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

interface MaterialListProps {
    materials: Material[];
}

export const MaterialList = ({ materials }: MaterialListProps) => {
    const getIconName = (type: string) => {
        switch (type) {
            case 'document': return 'document-text';
            case 'video': return 'videocam';
            case 'link': return 'link';
            default: return 'document';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'document': return '#EF4444'; // red-500
            case 'video': return '#F59E0B'; // amber-500
            case 'link': return '#3B82F6'; // blue-500
            default: return '#6B7280'; // gray-500
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'document': return 'bg-red-50 dark:bg-red-900/20';
            case 'video': return 'bg-amber-50 dark:bg-amber-900/20';
            case 'link': return 'bg-blue-50 dark:bg-blue-900/20';
            default: return 'bg-gray-50 dark:bg-gray-800';
        }
    };

    const handlePress = (url: string) => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    if (!materials || materials.length === 0) {
        return null;
    }

    return (
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-xl mr-3">
                    <Ionicons name="library" size={20} color="#8B5CF6" />
                </View>
                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Study Materials ({materials.length})
                </Text>
            </View>

            {materials.map((material, index) => (
                <TouchableOpacity
                    key={material.id || index}
                    onPress={() => handlePress(material.url)}
                    className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${getBgColor(material.type)}`}>
                        <Ionicons name={getIconName(material.type)} size={20} color={getIconColor(material.type)} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 dark:text-gray-100 font-bold text-base" numberOfLines={1}>
                            {material.title}
                        </Text>
                        {material.description && (
                            <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
                                {material.description}
                            </Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
            ))}
        </View>
    );
};
