import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface TestState {
    value: String
}

const initialState: TestState = {
    value: 'test'
}

export const testAsync = createAsyncThunk('test', async () => {
    return 'testasdasdasd'
})

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        incase: (state) => {
            state.value = 'test2'
        },
    },
    extraReducers: (builder) => {
        builder.addCase(testAsync.fulfilled, (state, action) => {
            state.value = action.payload
        })
    }
})

export const { incase } = testSlice.actions
export default testSlice.reducer