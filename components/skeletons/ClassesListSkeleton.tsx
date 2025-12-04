import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';

export const ClassesListSkeleton = () => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View className="px-4 pt-6">
            {/* Class Cards */}
            {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1 mr-2">
                            <Animated.View className="w-14 h-14 rounded-3xl bg-gray-200 dark:bg-gray-700 mr-4" style={{ opacity }} />
                            <View className="flex-1">
                                <Animated.View className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-2" style={{ opacity }} />
                                <Animated.View className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                            </View>
                        </View>
                        <Animated.View className="w-16 h-6 rounded-xl bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                    </View>
                    <View className="flex-row items-center pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <Animated.View className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700 mr-6" style={{ opacity }} />
                        <Animated.View className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                    </View>
                </View>
            ))}
        </View>
    );
};
