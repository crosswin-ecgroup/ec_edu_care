import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TodaysClassesSkeleton } from '../../components/skeletons/TodaysClassesSkeleton';
import { useGetClassesQuery } from '../../services/classes.api';
import { useAuthStore } from '../../store/auth.store';

export default function Dashboard() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { data: classes, isLoading } = useGetClassesQuery();
    const [showAllClasses, setShowAllClasses] = useState(false);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!classes) return { totalClasses: 0, totalTeachers: 0, totalStudents: 0 };

        const teacherSet = new Set<string>();
        const studentSet = new Set<string>();

        classes.forEach(cls => {
            cls.teachers?.forEach(t => teacherSet.add(t.teacherId));
            cls.students?.forEach(s => studentSet.add(s.studentId));
        });

        return {
            totalClasses: classes.length,
            totalTeachers: teacherSet.size,
            totalStudents: studentSet.size
        };
    }, [classes]);

    // Get Today's Classes
    const todaysClasses = useMemo(() => {
        if (!classes) return [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];

        return classes.filter(cls =>
            cls.dayOfWeek?.includes(today)
        );
    }, [classes]);

    const quickActions = [
        { icon: 'people', label: 'Teachers', subtitle: 'Manage Staff', color: ['#4F46E5', '#3730A3'], route: '/(tabs)/directory?type=teacher' },
        { icon: 'school', label: 'Students', subtitle: 'View Roster', color: ['#059669', '#047857'], route: '/(tabs)/directory?type=student' },
        { icon: 'calendar', label: 'Calendar', subtitle: 'Check Schedule', color: ['#D97706', '#B45309'], route: '/(tabs)/calendar' },
        { icon: 'add-circle', label: 'New Class', subtitle: 'Create Session', color: ['#DC2626', '#991B1B'], route: '/class/create' },
    ];

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Modern Header with Gradient */}
                <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-14 pb-8 px-6 rounded-b-[32px] shadow-lg"
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-blue-100 text-lg font-medium">Welcome back,</Text>
                            <Text className="text-white text-3xl font-bold mt-1">
                                {user?.name || 'Administrator'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/profile' as any)}
                            className="bg-white/20 p-2 rounded-full border border-white/30"
                        >
                            <Ionicons name="person" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Stats Row */}
                    <View className="flex-row justify-between bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{stats.totalClasses}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Classes</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-white/20">
                            <Text className="text-3xl font-bold text-white">{stats.totalTeachers}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Teachers</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-bold text-white">{stats.totalStudents}</Text>
                            <Text className="text-blue-100 text-xs mt-1">Students</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View className="px-6 mt-4">
                    {/* Quick Actions Grid */}
                    <View className="flex-row flex-wrap justify-between mb-6">
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push(action.route as any)}
                                className="w-[48%] mb-4"
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={action.color as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ borderRadius: 12 }}
                                    className="p-5 shadow-sm h-36 justify-between"
                                >
                                    <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center backdrop-blur-sm">
                                        <Ionicons name={action.icon as any} size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-lg leading-tight">
                                            {action.label}
                                        </Text>
                                        <Text className="text-white/80 text-xs font-medium mt-1">
                                            {action.subtitle}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Interesting Content */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Did You Know?
                        </Text>
                        <View className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 flex-row">
                            <View className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full h-10 w-10 items-center justify-center mr-3">
                                <Ionicons name="bulb" size={20} color="#D97706" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-amber-900 dark:text-amber-100 font-bold mb-1">
                                    Daily Tip
                                </Text>
                                <Text className="text-amber-800 dark:text-amber-200 text-sm leading-5">
                                    Regular communication with parents improves student performance by 25%. Try sending a weekly update!
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Today's Classes Section */}
                    <View className="mb-20">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                Today's Classes
                            </Text>
                            <Text className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                            </Text>
                        </View>

                        {isLoading ? (
                            <TodaysClassesSkeleton />
                        ) : todaysClasses.length > 0 ? (
                            <>
                                {todaysClasses.slice(0, showAllClasses ? todaysClasses.length : 5).map((item, index) => {
                                    // Safe time formatting with AM/PM
                                    let timeDisplay = 'View';
                                    if (item.sessionTime && item.sessionTime.hours !== undefined) {
                                        const hours = item.sessionTime.hours;
                                        const minutes = item.sessionTime.minutes || 0;
                                        const period = hours >= 12 ? 'PM' : 'AM';
                                        const displayHours = hours % 12 || 12;
                                        timeDisplay = `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
                                    } else if (item.startDate) {
                                        const date = new Date(item.startDate);
                                        if (!isNaN(date.getTime())) {
                                            timeDisplay = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                                        }
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => router.push(`/class/${item.classId}` as any)}
                                            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3 border border-gray-100 dark:border-gray-700 flex-row items-center"
                                            activeOpacity={0.9}
                                        >
                                            <View className="w-1 bg-green-500 h-full absolute left-0 rounded-l-2xl" />
                                            <View className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/30 items-center justify-center ml-2">
                                                <Text className="text-xl font-bold text-green-600 dark:text-green-400">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                            <View className="flex-1 ml-4">
                                                <Text className="text-base font-bold text-gray-800 dark:text-gray-100">
                                                    {item.name}
                                                </Text>
                                                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                                    {item.subject} • {item.standard || 'N/A'}
                                                </Text>
                                            </View>
                                            <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                <Text className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {timeDisplay}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}

                                {todaysClasses.length > 5 && (
                                    <TouchableOpacity
                                        onPress={() => setShowAllClasses(!showAllClasses)}
                                        className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800 items-center"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                            {showAllClasses ? 'Show Less' : `Show ${todaysClasses.length - 5} More`}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                                <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 dark:text-gray-400 mt-3 font-medium">
                                    No classes scheduled for today
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
