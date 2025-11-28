import { api } from './api.base';

export interface Teacher {
    userId: string;
    name: string;
    email?: string;
}

export interface Student {
    userId: string;
    name: string;
    email?: string;
}

export interface Class {
    classId: string;
    name: string;
    subject?: string;
    standard?: string;
    startDate: string;
    endDate: string;
    dayOfWeek?: string[];
    sessionTime?: {
        totalHours?: number;
        totalMinutes?: number;
    };
    createdOn: string;
    telegramGroupId?: number;
    telegramGroupLink?: string;
    teachers?: Teacher[];
    students?: Student[];
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
        createClass: builder.mutation<Class, Partial<Class>>({
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
        // Add other endpoints: addStudent, uploadMaterials, giveAssignment
    }),
});

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useGetClassDetailsQuery,
    useCreateClassMutation,
    useAssignTeacherMutation
} = classesApi;
