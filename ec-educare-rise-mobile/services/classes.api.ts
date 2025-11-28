import { api } from './api.base';

export interface Class {
    id: string;
    name: string;
    description: string;
    teacherId?: string;
    // Add other fields
}

export const classesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getClasses: builder.query<Class[], void>({
            query: () => '/classes',
            providesTags: ['Classes'],
        }),
        getClassDetails: builder.query<Class, string>({
            query: (id) => `/classes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Classes', id }],
        }),
        createClass: builder.mutation<Class, Partial<Class>>({
            query: (body) => ({
                url: '/classes',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Classes'],
        }),
        assignTeacher: builder.mutation<void, { classId: string; teacherId: string }>({
            query: ({ classId, teacherId }) => ({
                url: `/classes/${classId}/assignteacher`,
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
    useGetClassDetailsQuery,
    useCreateClassMutation,
    useAssignTeacherMutation
} = classesApi;
