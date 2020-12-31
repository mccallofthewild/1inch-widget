import { SetStateAction, useState } from 'react';
export const useDebounce = <T>(
	initialState: T | (() => T),
	delay: number
): [T, (val: SetStateAction<T>) => void, T] => {
	const [inDebounce, setInDebounce] = useState<ReturnType<typeof setTimeout>>();
	const [value, setValue] = useState<T>(initialState);
	const [immediateVal, setImmediateVal] = useState<T>(initialState);
	const setter = (val: SetStateAction<T>) => {
		clearTimeout(inDebounce);
		setImmediateVal(val);
		const timeout = setTimeout(() => setValue(val), delay);
		setInDebounce(timeout);
	};
	return [value, setter, immediateVal];
};
