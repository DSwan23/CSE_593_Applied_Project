import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { GenesisScenariosApiSlice } from './slices/GenesisScenarioAPI';
import ScenarioReducer from './slices/ScenariosSlice';

export const store = configureStore({
    reducer: {
        scenarios: ScenarioReducer,
        [GenesisScenariosApiSlice.reducerPath]: GenesisScenariosApiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(GenesisScenariosApiSlice.middleware)
})

// Set store specific typing, which can be used throughout the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;