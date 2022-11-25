import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ==> API Slice
export const SpacecraftDataApiSlice = createApi({
    reducerPath: "spacecraftDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8002' }),
    tagTypes: ['Spacecraft'],
    endpoints: builder => ({
        getAllSpacecraft: builder.query({
            query: (scenarioTemplateData: string[]) => ({
                url: `/spacecraft`,
                method: 'GET',
                headers: [['scenario', scenarioTemplateData[0]], ['templatepath', scenarioTemplateData[1]]]// 'D:\\Git_Projects\\CSE_593_Applied_Project\\Code\\TemplateDatabase\\Spacecraft\\v_1\\']]
            }),
            providesTags: ['Spacecraft']
        }),
    })
});

// ==> Export the API queries
export const {
    useGetAllSpacecraftQuery
} = SpacecraftDataApiSlice;