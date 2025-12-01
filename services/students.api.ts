import { CreateStudentDto, Student } from '@/types/api.types';
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
    }),
});

export const {
    useGetStudentsQuery,
    useLazyGetStudentsQuery,
    useGetStudentByIdQuery,
    useCreateStudentMutation,
} = studentsApi;
