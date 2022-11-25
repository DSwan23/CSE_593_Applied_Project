import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ==> API Slice
export const TemplateDatabaseApiSlice = createApi({
    reducerPath: "TemplateDatabaseApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000' }),
    tagTypes: ['DataModel'],
    endpoints: builder => ({
        getTemplateDataModel: builder.query({
            query: path => ({
                url: `/TemplateDatabase/${path}`,
                method: 'GET',
            }),
            providesTags: ['DataModel']
        }),
    })
});

// ==> Export the API queries
export const {
    useGetTemplateDataModelQuery
} = TemplateDatabaseApiSlice;