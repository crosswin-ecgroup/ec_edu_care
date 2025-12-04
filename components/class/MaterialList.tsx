import { Material } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

interface MaterialListProps {
    materials: Material[];
}

export const MaterialList = ({ materials }: MaterialListProps) => {
    const getFileExtension = (filename: string) => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    };

    const getIconName = (title: string, type: string) => {
        const ext = getFileExtension(title);
        if (type === 'video') return 'videocam';
        if (type === 'link') return 'link';

        switch (ext) {
            case 'pdf': return 'document-text';
            case 'doc':
            case 'docx': return 'document';
            case 'xls':
            case 'xlsx': return 'grid';
            case 'ppt':
            case 'pptx': return 'easel';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'image';
            case 'zip':
            case 'rar': return 'folder-open';
            default: return 'document-text';
        }
    };

    const getIconColor = (title: string, type: string) => {
        const ext = getFileExtension(title);
        if (type === 'video') return '#F59E0B'; // amber-500
        if (type === 'link') return '#3B82F6'; // blue-500

        switch (ext) {
            case 'pdf': return '#EF4444'; // red-500
            case 'doc':
            case 'docx': return '#3B82F6'; // blue-500
            case 'xls':
            case 'xlsx': return '#10B981'; // emerald-500
            case 'ppt':
            case 'pptx': return '#F97316'; // orange-500
            case 'jpg':
            case 'jpeg':
            case 'png': return '#8B5CF6'; // violet-500
            case 'zip':
            case 'rar': return '#6B7280'; // gray-500
            default: return '#6B7280'; // gray-500
        }
    };

    const getBgColor = (title: string, type: string) => {
        const ext = getFileExtension(title);
        if (type === 'video') return 'bg-amber-50 dark:bg-amber-900/20';
        if (type === 'link') return 'bg-blue-50 dark:bg-blue-900/20';

        switch (ext) {
            case 'pdf': return 'bg-red-50 dark:bg-red-900/20';
            case 'doc':
            case 'docx': return 'bg-blue-50 dark:bg-blue-900/20';
            case 'xls':
            case 'xlsx': return 'bg-emerald-50 dark:bg-emerald-900/20';
            case 'ppt':
            case 'pptx': return 'bg-orange-50 dark:bg-orange-900/20';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'bg-violet-50 dark:bg-violet-900/20';
            case 'zip':
            case 'rar': return 'bg-gray-50 dark:bg-gray-800';
            default: return 'bg-gray-50 dark:bg-gray-800';
        }
    };

    const getFullUrl = (url: string) => {
        // Handle null/undefined URLs
        if (!url) {
            return '';
        }
        // If URL starts with http:// or https://, it's already absolute
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // Otherwise, prepend the base API URL
        const baseUrl = 'https://ec-edu-care-rise-fmb9d2ehd9bmhrgb.centralindia-01.azurewebsites.net/';
        // Remove leading slash if present to avoid double slashes
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${path}`;
    };

    const handlePress = (url: string) => {
        const fullUrl = getFullUrl(url);
        console.log('MaterialList: Original URL:', url);
        console.log('MaterialList: Full URL:', fullUrl);

        if (fullUrl) {
            Linking.canOpenURL(fullUrl).then(supported => {
                if (supported) {
                    Linking.openURL(fullUrl).catch(err => console.error("Couldn't load page", err));
                } else {
                    console.error("Don't know how to open URI: " + fullUrl);
                }
            });
        } else {
            console.warn('MaterialList: No URL provided for material');
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

            {materials.map((material, index) => {
                const fileName = material.fileName || material.title || '';
                const fileUrl = material.fileUrl || material.url || '';
                const materialType = material.type || 'document';

                return (
                    <TouchableOpacity
                        key={material.materialId || material.id || index}
                        onPress={() => handlePress(fileUrl)}
                        className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${getBgColor(fileName, materialType)}`}>
                            <Ionicons name={getIconName(fileName, materialType) as any} size={20} color={getIconColor(fileName, materialType)} />
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
                );
            })}
        </View>
    );
};
