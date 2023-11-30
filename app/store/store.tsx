'use client';

import { configureStore } from '@reduxjs/toolkit';
import testReducer from './slices/testSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
    reducer: {
        test: testReducer,
        products: productReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch