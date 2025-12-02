import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const TodaysClassesSkeleton = () => {
    return (
        <View>
            {[1, 2, 3].map((key) => (
                <View
                    key={key}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3 border border-gray-100 dark:border-gray-700 flex-row items-center"
                >
                    <View className="w-1 bg-gray-200 dark:bg-gray-700 h-full absolute left-0 rounded-l-2xl" />
                    <Skeleton width={48} height={48} borderRadius={16} className="ml-2" />
                    <View className="flex-1 ml-4">
                        <Skeleton width="60%" height={16} className="mb-2" />
                        <Skeleton width="40%" height={12} />
                    </View>
                    <Skeleton width={60} height={24} borderRadius={12} />
                </View>
            ))}
        </View>
    );
};
