export interface Teacher {
    teacherId: string;
    fullName: string;
    email?: string;
    mobileNumber?: string;
    telegramUserId?: number;
    createdOn: string;
}

export interface Student {
    studentId: string;
    fullName: string;
    grade?: string;
    mobileNumber?: string;
    telegramUserId?: number;
    createdOn: string;
    classes?: Class[];
}

export interface Material {
    id: string;
    title: string;
    description?: string;
    url: string;
    type: 'document' | 'video' | 'link';
    createdAt: string;
}

export interface Class {
    classId: string;
    name: string;
    standard: string;
    section: string;
    subject: string;
    image?: string;
    teacherId?: string;
    teacherName?: string;
    studentCount?: number;
    startDate?: string;
    endDate?: string;
    sessionTime?: string;
    dayOfWeek?: string | string[];
    teachers?: Teacher[];
    students?: Student[];
    telegramGroupLink?: string;
}

export interface TimeSpan {
    ticks?: number;
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    seconds?: number;
    totalDays?: number;
    totalHours?: number;
    totalMilliseconds?: number;
    totalMinutes?: number;
    totalSeconds?: number;
}

export interface CreateTeacherDto {
    fullName?: string;
    mobileNumber?: string;
    email?: string;
    password?: string;
}

export interface CreateStudentDto {
    fullName?: string;
    grade?: string;
    mobileNumber?: string;
}

export interface CreateClassDto {
    name?: string;
    subject?: string;
    standard?: string;
    startDate: string;
    endDate: string;
    dayOfWeek?: string[];
    sessionTime?: TimeSpan;
}

export interface ClassSession {
    classSessionId: string;
    classId: string;
    title?: string;
    description?: string;
    scheduledDateTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    durationMinutes: number;
    status?: string;
    meetingLink?: string;
    notes?: string;
    createdOn: string;
}

export interface MarkAttendanceDto {
    studentId: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    notes?: string;
}

export interface SessionAttendance {
    sessionAttendanceId: string;
    classSessionId: string;
    studentId: string;
    studentName?: string;
    status?: string;
    markedAt?: string;
    markedBy?: string;
    notes?: string;
    createdOn: string;
}

export interface UpdateSessionScheduleDto {
    newStartDate?: string; // ISO date-time string
    newEndDate?: string; // ISO date-time string
    dayOfWeek?: string[] | null;
    sessionTime?: any; // TimeSpan object
    sessionDurationMinutes?: number;
}

export interface UpdateSingleSessionDto {
    newDate?: string; // ISO date-time string
    newTime?: any; // TimeSpan object
    newDurationMinutes?: number;
}

export interface ClassDashboardDto {
    classId: string;
    className: string;
    subject: string;
    standard: string;
    section: string;
    studentCount: number;
    nextSession?: ClassSession;
    recentSessions?: ClassSession[];
    attendanceSummary?: {
        totalSessions: number;
        averageAttendance: number;
    };
    teachers?: Teacher[];
    students?: Student[];
    telegramGroupLink?: string;
    dayOfWeek?: string | string[];
    sessionTime?: string;
    startDate?: string;
    endDate?: string;
}
