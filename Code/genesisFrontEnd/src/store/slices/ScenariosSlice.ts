import { createSlice } from "@reduxjs/toolkit";

// ==> Data Interfaces


// ==> Entity Adapter


// ==> Slice
const ScenariosSlice = createSlice({
    name: 'scenarios',
    initialState: 0,
    reducers: {
    },
    extraReducers: {}
})

// Export any reducer actions
export const { } = ScenariosSlice.actions;
// Export any selectors that may be used to access this data

// Export all of the slice reducers to be declared in the global store
export default ScenariosSlice.reducer;