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
    sessionTime?: TimeSpan;
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
    totalStudents: number;
    totalSessions: number;
    completedSessions: number;
    totalAssignments: number;
    totalSubmissions: number;
    overallAttendanceRate: number;
    totalPresentCount: number;
    totalLateCount: number;
    totalAbsentCount: number;
    submissionRate: number;
    averageGrade: number;
    nextSession?: ClassSession;
    recentSessions?: any[];
    recentAssignments?: any[];
    attendanceTrend?: any[];
    gradeDistribution?: any[];
    studentPerformances?: any[];
}

export interface AssignmentGroupSummaryDto {
    assignmentBatchId: string;
    title: string;
    description?: string;
    dueDate: string;
    assignedOn: string;
    maxScore: number;
    studentCount: number;
    submissionCount: number;
    averageGrade?: number;
}

export interface AssignmentWithSubmissionDto {
    classStudentAssignmentId: string;
    classId: string;
    classStudentId: string;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentMobile?: string;
    title: string;
    description?: string;
    dueDate: string;
    assignedOn: string;
    maxScore: number;
    status: string;
    submittedOn?: string;
    gradedOn?: string;
    grade?: number;
    feedback?: string;
}

export interface StudentSummaryStatsDto {
    totalSessions: number;
    attendedSessions: number;
    lateCount: number;
    absentCount: number;
    attendancePercentage: number;
    totalAssignments: number;
    submittedCount: number;
    gradedCount: number;
    pendingCount: number;
    missingCount: number;
    submissionRate: number;
    averageScore: number;
    overallGrade?: string;
}

export interface StudentAttendanceRecordDto {
    sessionId: string;
    sessionDate: string;
    status: string;
    markedAt?: string;
}

export interface StudentAssignmentRecordDto {
    assignmentId: string;
    title: string;
    dueDate: string;
    status: string;
    submittedOn?: string;
    grade?: number;
    maxScore: number;
    feedback?: string;
}

export interface ClassStudentDetailDto {
    studentId: string;
    classStudentId: string;
    fullName: string;
    email?: string;
    grade?: string;
    mobileNumber?: string;
    enrolledOn: string;
    classId: string;
    className: string;
    subject?: string;
    standard?: string;
    academicYear?: string;
    summary: StudentSummaryStatsDto;
    attendanceRecords?: StudentAttendanceRecordDto[];
    assignmentRecords?: StudentAssignmentRecordDto[];
}

export interface TeacherPerformanceDto {
    teacherId: string;
    teacherName?: string;
    classCount: number;
    totalStudents: number;
    totalSessions: number;
    averageAttendanceRate?: number;
    averageSubmissionRate?: number;
}

export interface MonthlyTrendDto {
    month?: string;
    year: number;
    sessionCount: number;
    attendanceRate: number;
    assignmentsDue: number;
    submissionRate: number;
}

export interface ClassSummaryDto {
    classId: string;
    className?: string;
    subject?: string;
    standard?: string;
    studentCount: number;
    attendanceRate?: number;
    submissionRate?: number;
    averageGrade?: number;
}

export interface AcademicYearReportDto {
    academicYear?: string;
    totalClasses: number;
    totalStudents: number;
    totalTeachers: number;
    totalSessions: number;
    completedSessions: number;
    totalAssignments: number;
    totalSubmissions: number;
    overallAttendanceRate: number;
    overallSubmissionRate: number;
    averageGrade: number;
    classes?: ClassSummaryDto[];
    teacherPerformances?: TeacherPerformanceDto[];
    monthlyTrends?: MonthlyTrendDto[];
}
