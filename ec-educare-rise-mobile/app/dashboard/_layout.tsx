import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4F46E5', // Primary indigo
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB', // gray-200
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
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="classes"
                options={{
                    title: 'Classes',
                    tabBarLabel: 'Classes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="directory"
                options={{
                    title: 'Directory',
                    tabBarLabel: 'Directory',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="class-details"
                options={{
                    title: 'Class Details',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="create-class"
                options={{
                    title: 'Create Class',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="create-student"
                options={{
                    title: 'Create Student',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="create-teacher"
                options={{
                    title: 'Create Teacher',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="teacher-details"
                options={{
                    title: 'Teacher Details',
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="student-details"
                options={{
                    title: 'Student Details',
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
