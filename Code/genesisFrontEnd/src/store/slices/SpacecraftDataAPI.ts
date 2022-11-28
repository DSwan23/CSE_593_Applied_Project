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
                headers: [['scenario', scenarioTemplateData[0]], ['templatepath', scenarioTemplateData[1]]]
            }),
            providesTags: ['Spacecraft']
        }),
        addSpacecraft: builder.mutation({
            query: (Data: any[]) => ({
                url: `/spacecraft/add`,
                method: 'POST',
                headers: [['scenario', Data[0]], ['templatepath', Data[1]]],
                body: JSON.parse(Data[2])
            }),
            invalidatesTags: ['Spacecraft'],
        }),
        updateSpacecraft: builder.mutation({
            query: (Data: any[]) => ({
                url: `/spacecraft/update`,
                method: 'PUT',
                headers: [['scenario', Data[0]], ['templatepath', Data[1]]],
                body: JSON.parse(Data[2])
            }),
            invalidatesTags: ['Spacecraft'],
        }),
        removeSpacecraft: builder.mutation({
            query: (Data: any[]) => ({
                url: `/spacecraft/remove/${Data[2]}`,
                method: 'DELETE',
                headers: [['scenario', Data[0]], ['templatepath', Data[1]]],
            }),
            invalidatesTags: ['Spacecraft'],
        }),
    })
});

// ==> Export the API queries
export const {
    useGetAllSpacecraftQuery, useAddSpacecraftMutation, useUpdateSpacecraftMutation, useRemoveSpacecraftMutation
} = SpacecraftDataApiSlice;