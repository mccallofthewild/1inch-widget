import { SetStateAction, useState } from 'react';
export const useDebounce = <T>(initialState: T | (() => T), delay: number) => {
	const [inDebounce, setInDebounce] = useState<ReturnType<typeof setTimeout>>();
	const [value, setValue] = useState<T>(initialState);
	const setter = (val: SetStateAction<T>) => {
		clearTimeout(inDebounce);
		const timeout = setTimeout(() => setValue(val), delay);
		setInDebounce(timeout);
	};
	return [value, setter] as const;
};
