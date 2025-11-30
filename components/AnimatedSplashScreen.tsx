import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    withSequence,
    withSpring,
    withDelay,
    Easing,
    interpolate
} from 'react-native-reanimated';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface AnimatedSplashScreenProps {
    children: React.ReactNode;
    image: any;
}

export function AnimatedSplashScreen({ children, image }: AnimatedSplashScreenProps) {
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.3);
    const translateY = useSharedValue(50);

    useEffect(() => {
        async function prepare() {
            try {
                // Simulate loading time
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppReady(true);
            }
        }

        prepare();
    }, []);

    const onImageLoaded = useCallback(async () => {
        try {
            await SplashScreen.hideAsync();

            // Entrance animation - fade in and scale up
            opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
            scale.value = withSpring(1, {
                damping: 12,
                stiffness: 100,
            });
            translateY.value = withSpring(0, {
                damping: 12,
                stiffness: 100,
            });

            // Wait a bit, then exit
            opacity.value = withDelay(
                1200,
                withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, (finished) => {
                    if (finished) {
                        runOnJS(setAnimationComplete)(true);
                    }
                })
            );

            scale.value = withDelay(
                1200,
                withTiming(1.2, { duration: 500, easing: Easing.in(Easing.cubic) })
            );
        } catch (e) {
            console.warn(e);
        }
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ],
        };
    });

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(opacity.value, [0, 1], [1, 1]),
        };
    });

    if (!isAppReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            {isSplashAnimationComplete && children}
            {!isSplashAnimationComplete && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: '#3B82F6', // Blue background
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        backgroundStyle
                    ]}
                >
                    <Animated.Image
                        source={image}
                        style={[
                            {
                                width: 200,
                                height: 200,
                                resizeMode: 'contain'
                            },
                            animatedStyle,
                        ]}
                        onLoadEnd={onImageLoaded}
                    />
                </Animated.View>
            )}
        </View>
    );
}
