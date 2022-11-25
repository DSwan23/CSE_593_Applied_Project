import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ==> API Slice
export const GenesisScenariosApiSlice = createApi({
    reducerPath: "genesisScenariosApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8001' }),
    tagTypes: ['Scenarios', 'Templates'],
    endpoints: builder => ({
        getAllScenarios: builder.query({
            query: () => '/scenarios',
            providesTags: ['Scenarios']
        }),
        getScenario: builder.query({
            query: scenarioId => `/scenarios/${scenarioId}`,
        }),
        addNewScenario: builder.mutation({
            query: newScenario => ({
                url: '/scenarios/add',
                method: 'POST',
                body: newScenario
            }),
            invalidatesTags: ['Scenarios']
        }),
        updateScenario: builder.mutation({
            query: updatedScenario => ({
                url: '/scenarios/update',
                method: 'PUT',
                body: updatedScenario
            }),
            invalidatesTags: ['Scenarios']
        }),
        removeScenario: builder.mutation({
            query: scenarioId => ({
                url: `/scenarios/remove/${scenarioId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Scenarios']
        }),
        addTemplateToScenario: builder.mutation({
            query: (scenarioTemplateId: number[]) => ({
                url: `/scenarios/${scenarioTemplateId[0]}/add/template/${scenarioTemplateId[1]}`,
                method: 'POST',
            }),
            invalidatesTags: ['Scenarios']
        }),
        getAllTemplates: builder.query({
            query: () => '/templates',
            providesTags: ['Templates']
        }),
        getTemplate: builder.query({
            query: templateId => `/templates/${templateId}`,
        }),
        addNewTemplate: builder.mutation({
            query: newTemplate => ({
                url: '/templates/add',
                method: 'POST',
                body: newTemplate
            }),
            invalidatesTags: ['Templates']
        }),
        updateTemplate: builder.mutation({
            query: updatedTemplate => ({
                url: '/templates/update',
                method: 'PUT',
                body: updatedTemplate
            }),
            invalidatesTags: ['Templates']
        }),
        removeTemplate: builder.mutation({
            query: templateId => ({
                url: `/templates/remove/${templateId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Templates', 'Scenarios']
        }),
    })
});

// ==> Export the API queries
export const {
    useGetAllScenariosQuery, useGetScenarioQuery, useAddNewScenarioMutation, useUpdateScenarioMutation, useRemoveScenarioMutation,
    useGetAllTemplatesQuery, useGetTemplateQuery, useAddNewTemplateMutation, useUpdateTemplateMutation, useRemoveTemplateMutation,
    useAddTemplateToScenarioMutation
} = GenesisScenariosApiSlice;