import { api } from './api.base';

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

export interface Class {
    classId: string;
    name: string;
    subject?: string;
    standard?: string;
    startDate: string;
    endDate: string;
    dayOfWeek?: string[];
    sessionTime?: TimeSpan;
    createdOn: string;
    telegramGroupId?: number;
    telegramGroupLink?: string;
    teachers?: Teacher[];
    students?: Student[];
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

export const classesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getClasses: builder.query<Class[], void>({
            query: () => '/Classes',
            providesTags: ['Classes'],
        }),
        getClassById: builder.query<Class, string>({
            query: (id) => `/Classes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Classes', id }],
        }),
        getClassDetails: builder.query<Class, string>({
            query: (id) => `/Classes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Classes', id }],
        }),
        getTeachers: builder.query<Teacher[], void>({
            query: () => '/Teachers',
            providesTags: ['Teachers'],
        }),
        getStudents: builder.query<Student[], void>({
            query: () => '/Students',
            providesTags: ['Students'],
        }),
        createClass: builder.mutation<Class, CreateClassDto>({
            query: (body) => ({
                url: '/Classes',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Classes'],
        }),
        assignTeacher: builder.mutation<void, { classId: string; teacherId: string }>({
            query: ({ classId, teacherId }) => ({
                url: `/Classes/${classId}/assignteacher`,
                method: 'POST',
                body: { teacherId },
            }),
            invalidatesTags: (result, error, { classId }) => [{ type: 'Classes', id: classId }],
        }),
        createTeacher: builder.mutation<Teacher, CreateTeacherDto>({
            query: (body) => ({
                url: '/Teachers',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Teachers'],
        }),
        createStudent: builder.mutation<Student, CreateStudentDto>({
            query: (body) => ({
                url: '/Students',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Students'],
        }),
    }),
});

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useGetClassDetailsQuery,
    useGetTeachersQuery,
    useGetStudentsQuery,
    useCreateClassMutation,
    useAssignTeacherMutation,
    useCreateTeacherMutation,
    useCreateStudentMutation
} = classesApi;
