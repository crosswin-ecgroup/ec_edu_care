import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const ClassesSkeleton = () => {
    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-6">
            <View className="flex-row justify-between items-center mb-4 px-2">
                <Skeleton width={100} height={20} />
            </View>

            {[1, 2, 3, 4, 5].map((key) => (
                <View
                    key={key}
                    className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700"
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1 mr-2">
                            <Skeleton width={56} height={56} borderRadius={24} className="mr-4" />
                            <View className="flex-1">
                                <Skeleton width="70%" height={24} className="mb-2" />
                                <Skeleton width="40%" height={16} />
                            </View>
                        </View>
                        <Skeleton width={60} height={24} borderRadius={12} />
                    </View>

                    <View className="flex-row items-center pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <View className="flex-row items-center mr-6">
                            <Skeleton width={80} height={16} />
                        </View>
                        <View className="flex-row items-center">
                            <Skeleton width={80} height={16} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};
