import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { incase, testAsync } from '../store/slices/testSlice'

function TestComponent() {
    const { value } = useAppSelector((state) => state.test);
    const dispatch = useAppDispatch();
    return (
        <div>
            <button onClick={() => dispatch(incase())}>test</button>
            <button onClick={() => dispatch(testAsync())}>testssss</button>
            <h1>{value}</h1>
        </div>
    )
}

export default TestComponent