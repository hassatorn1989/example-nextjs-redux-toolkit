'use client';
import TestComponent from './components/test';
import { useAppSelector } from './store/hooks';
import { store } from './store/store';
export default function Home() {
  const { value } = useAppSelector((state) => state.test);
  return (
    <div>
      <h1>Main : {value}</h1>
      <TestComponent />
    </div>
  )
}
