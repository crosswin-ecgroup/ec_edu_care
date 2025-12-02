import { getSubjectIcon } from '@/utils/subjectIcons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface ClassHeaderProps {
    name: string;
    subject: string;
    standard?: string;
}

export const ClassHeader = ({ name, subject, standard }: ClassHeaderProps) => {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#4F46E5', '#3730A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="pt-14 pb-12 px-6 rounded-b-[32px] shadow-lg"
        >
            <View className="flex-row justify-between items-start mb-6">
                <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-white/20 p-2 rounded-full">
                    <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mr-4 backdrop-blur-md">
                    <Ionicons name={getSubjectIcon(subject)} size={32} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-3xl font-bold text-white mb-1 shadow-sm">
                        {name}
                    </Text>
                    <View className="flex-row items-center">
                        <View className="bg-white/20 px-3 py-1 rounded-full mr-2">
                            <Text className="text-white text-xs font-medium">
                                {standard}
                            </Text>
                        </View>
                        <Text className="text-indigo-200 text-sm font-medium">
                            {subject}
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};
