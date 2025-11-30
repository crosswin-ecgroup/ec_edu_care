import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { TouchableOpacity, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4F46E5', // Primary indigo
                tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
                tabBarStyle: {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#374151' : '#E5E7EB',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="classes"
                options={{
                    title: 'Classes',
                    tabBarLabel: 'Classes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar/index"
                options={{
                    title: 'Calendar',
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="directory/index"
                options={{
                    title: 'Directory',
                    tabBarLabel: 'Directory',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="class/[id]"
                options={{
                    title: 'Class Details',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="class/create"
                options={{
                    title: 'Create Class',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="student/create"
                options={{
                    title: 'Create Student',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="teacher/create"
                options={{
                    title: 'Create Teacher',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="teacher/[id]"
                options={{
                    title: 'Teacher Details',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="student/[id]"
                options={{
                    title: 'Student Details',
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
