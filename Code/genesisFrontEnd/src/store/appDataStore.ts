import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { GenesisScenariosApiSlice } from './slices/GenesisScenarioAPI';
import ScenarioReducer from './slices/ScenariosSlice';
import { SpacecraftDataApiSlice } from './slices/SpacecraftDataAPI';
import { TemplateDatabaseApiSlice } from './slices/TemplateDatabaseAPI';

export const store = configureStore({
    reducer: {
        scenarios: ScenarioReducer,
        [GenesisScenariosApiSlice.reducerPath]: GenesisScenariosApiSlice.reducer,
        [SpacecraftDataApiSlice.reducerPath]: SpacecraftDataApiSlice.reducer,
        [TemplateDatabaseApiSlice.reducerPath]: TemplateDatabaseApiSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(GenesisScenariosApiSlice.middleware)
        .concat(SpacecraftDataApiSlice.middleware)
        .concat(TemplateDatabaseApiSlice.middleware)
})

// Set store specific typing, which can be used throughout the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;