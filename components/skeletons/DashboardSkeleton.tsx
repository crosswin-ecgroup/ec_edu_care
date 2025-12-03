import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';

export const DashboardSkeleton = () => {
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
        <View className="mb-6">
            {/* Stats Grid Skeleton */}
            <View className="flex-row flex-wrap gap-3 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} className="flex-1 min-w-[45%] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 h-32">
                        <Animated.View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mb-2" style={{ opacity }} />
                        <Animated.View className="w-16 h-8 rounded bg-gray-200 dark:bg-gray-700 mb-2" style={{ opacity }} />
                        <Animated.View className="w-12 h-3 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                    </View>
                ))}
            </View>

            {/* Class Performance Skeleton */}
            <View className="mb-8">
                <Animated.View className="w-48 h-6 rounded bg-gray-200 dark:bg-gray-700 mb-4" style={{ opacity }} />
                {[1, 2].map((i) => (
                    <View key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700 h-32">
                        <View className="flex-row justify-between mb-4">
                            <View className="flex-row">
                                <Animated.View className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 mr-3" style={{ opacity }} />
                                <View>
                                    <Animated.View className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-2" style={{ opacity }} />
                                    <Animated.View className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                                </View>
                            </View>
                            <Animated.View className="w-12 h-6 rounded-lg bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                        </View>
                        <View className="flex-row justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                            <Animated.View className="w-16 h-8 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                            <Animated.View className="w-16 h-8 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Teacher Performance Skeleton */}
            <View>
                <Animated.View className="w-56 h-6 rounded bg-gray-200 dark:bg-gray-700 mb-4" style={{ opacity }} />
                {[1, 2].map((i) => (
                    <View key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700 h-32">
                        <View className="flex-row justify-between mb-4">
                            <View className="flex-row">
                                <Animated.View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" style={{ opacity }} />
                                <View>
                                    <Animated.View className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-2" style={{ opacity }} />
                                    <Animated.View className="w-24 h-3 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                                </View>
                            </View>
                        </View>
                        <View className="flex-row justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                            <Animated.View className="w-16 h-8 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                            <Animated.View className="w-16 h-8 rounded bg-gray-200 dark:bg-gray-700" style={{ opacity }} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
