import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://195.43.142.64:8080/logos-lms/api/v1',
        credentials: 'include',
    }),
    endpoints: () => ({}),
});

export default baseApi;
