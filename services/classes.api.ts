import { Class, CreateClassDto } from '@/types/api.types';
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
    }),
});

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useGetClassDetailsQuery,
    useCreateClassMutation,
    useAssignTeacherMutation,
    useAddStudentToClassMutation,
    useRemoveTeacherFromClassMutation,
    useRemoveStudentFromClassMutation,
    useGetMaterialsQuery,
} = classesApi;
