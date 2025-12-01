import { CreateTeacherDto, Teacher } from '@/types/api.types';
import { api } from './api.base';

export const teachersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query<Teacher[], void>({
            query: () => '/Teachers',
            providesTags: ['Teachers'],
        }),
        getTeacherById: builder.query<Teacher, string>({
            query: (id) => `/Teachers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Teachers', id }],
        }),
        createTeacher: builder.mutation<Teacher, CreateTeacherDto>({
            query: (body) => ({
                url: '/Teachers',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Teachers'],
        }),
    }),
});

export const {
    useGetTeachersQuery,
    useLazyGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
} = teachersApi;
