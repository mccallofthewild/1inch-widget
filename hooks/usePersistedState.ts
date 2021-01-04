import { SetStateAction, useEffect, useState } from 'react';
export const usePersistedState = <T>(
	initialState: T | (() => T),
	cacheKey: string,
	cacheDuration = 1000 * 60 * 60 * 24
) => {
	const cacheTimestampKey = cacheKey + '---timestamp';
	const [value, setValue] = useState<T>(initialState);
	useEffect(() => {
		try {
			const timestamp = localStorage.getItem(cacheTimestampKey);
			if (timestamp && +timestamp > Math.abs(Date.now() - cacheDuration)) {
				const item = localStorage.getItem(cacheKey);
				setValue(JSON.parse(item));
			}
		} catch (e) {}
	}, []);
	const setter = (val: SetStateAction<T>) => {
		setValue(val);
		localStorage.setItem(cacheKey, JSON.stringify(val));
		localStorage.setItem(cacheTimestampKey, Date.now().toString());
	};
	return [value, setter] as const;
};
