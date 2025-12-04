import { CreateStudentDto, Student, UpdateStudentDto } from '@/types/api.types';
import { api } from './api.base';

export const studentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudents: builder.query<Student[], void>({
            query: () => '/Students',
            providesTags: ['Students'],
        }),
        getStudentById: builder.query<Student, string>({
            query: (id) => `/Students/${id}`,
            providesTags: (result, error, id) => [{ type: 'Students', id }],
        }),
        createStudent: builder.mutation<Student, CreateStudentDto>({
            query: (body) => ({
                url: '/Students',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Students'],
        }),
        updateStudent: builder.mutation<Student, { id: string; body: UpdateStudentDto }>({
            query: ({ id, body }) => ({
                url: `/Students/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Students', id },
                { type: 'Students', id: 'LIST' }
            ],
        }),
    }),
});

export const {
    useGetStudentsQuery,
    useLazyGetStudentsQuery,
    useGetStudentByIdQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
} = studentsApi;
