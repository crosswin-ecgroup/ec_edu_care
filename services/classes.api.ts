import { Class, ClassDashboardDto, CreateClassDto, UpdateSessionScheduleDto } from '@/types/api.types';
import { api } from './api.base';

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
        addStudentToClass: builder.mutation<void, { classId: string; studentId: string }>({
            query: ({ classId, studentId }) => ({
                url: `/Classes/${classId}/students`,
                method: 'POST',
                body: { studentId },
            }),
            invalidatesTags: (result, error, { classId }) => [{ type: 'Classes', id: classId }],
        }),
        removeTeacherFromClass: builder.mutation<void, { classId: string; teacherId: string }>({
            query: ({ classId, teacherId }) => ({
                url: `/Classes/${classId}/teachers/${teacherId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { classId }) => [{ type: 'Classes', id: classId }],
        }),
        removeStudentFromClass: builder.mutation<void, { classId: string; studentId: string }>({
            query: ({ classId, studentId }) => ({
                url: `/Classes/${classId}/students/${studentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { classId }) => [{ type: 'Classes', id: classId }],
        }),
        getMaterials: builder.query<any[], string>({
            query: (classId) => `/classes/${classId}/materials`,
            providesTags: (result, error, classId) => [{ type: 'Classes', id: classId }],
        }),
        getClassDashboard: builder.query<ClassDashboardDto, string>({
            query: (classId) => `classes/${classId}/dashboard`,
            providesTags: (result, error, id) => [{ type: 'Classes', id }],
        }),
        updateClassSchedule: builder.mutation<void, { classId: string; body: UpdateSessionScheduleDto }>({
            query: ({ classId, body }) => ({
                url: `classes/${classId}/schedule/update`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { classId }) => [
                { type: 'Classes', id: classId },
                { type: 'Sessions', id: 'LIST' }
            ],
        }),
        deleteSession: builder.mutation<void, { classId: string; sessionId: string }>({
            query: ({ classId, sessionId }) => ({
                url: `/classes/${classId}/schedule/sessions/${sessionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { classId }) => [
                { type: 'Classes', id: classId },
                { type: 'Sessions' }
            ],
        }),
        getAssignmentsGrouped: builder.query<any, string>({
            query: (classId) => `/classes/${classId}/assignments/grouped`,
            providesTags: (result, error, classId) => [{ type: 'Classes', id: classId }],
        }),
        getAssignmentsWithSubmissions: builder.query<any, string>({
            query: (classId) => `/classes/${classId}/assignments/with-submissions`,
            providesTags: (result, error, classId) => [{ type: 'Classes', id: classId }],
        }),
        getStudentClassDetail: builder.query<any, { classId: string; studentId: string }>({
            query: ({ classId, studentId }) => `/Classes/${classId}/students/${studentId}/detail`,
            providesTags: (result, error, { classId, studentId }) => [
                { type: 'Classes', id: classId },
                { type: 'Classes', id: `student-${studentId}` }
            ],
        }),
    }),
});

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useGetClassDashboardQuery,
    useCreateClassMutation,
    useAssignTeacherMutation,
    useAddStudentToClassMutation,
    useRemoveTeacherFromClassMutation,
    useRemoveStudentFromClassMutation,
    useGetMaterialsQuery,
    useUpdateClassScheduleMutation,
    useDeleteSessionMutation,
    useGetAssignmentsGroupedQuery,
    useGetAssignmentsWithSubmissionsQuery,
    useGetStudentClassDetailQuery,
} = classesApi;
