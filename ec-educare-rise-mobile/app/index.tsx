import { View, ActivityIndicator, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    return (
        <View className="flex-1">
            <LinearGradient
                colors={['#4F46E5', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 items-center justify-center"
            >
                <View className="bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                    <Image
                        source={require('../assets/images/logo.jpg')}
                        className="w-32 h-32 rounded-full"
                        resizeMode="contain"
                    />
                </View>

                <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
                    EC Edu Care
                </Text>
                <Text className="text-blue-200 text-lg font-medium mb-12 tracking-wide">
                    Empowering Education
                </Text>

                <ActivityIndicator size="large" color="white" />
            </LinearGradient>
        </View>
    );
}
