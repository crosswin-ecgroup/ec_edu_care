import { AcademicYearReportDto } from '../types/api.types';
import { api } from './api.base';

export const academicYearApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAcademicYearReport: builder.query<AcademicYearReportDto, string>({
            query: (academicYear) => `/academic-years/${academicYear}/report`,
            providesTags: ['AcademicYear'],
        }),
    }),
});

export const {
    useGetAcademicYearReportQuery,
} = academicYearApi;
