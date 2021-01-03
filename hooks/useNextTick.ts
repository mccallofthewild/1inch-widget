import { useEffect } from 'react';

export const useNextTick = () => {
	const callbacks = [];
	useEffect(() => {
		callbacks.forEach((cb) => cb());
	});
	return () => {
		return new Promise<void>((r) => {
			callbacks.push(r);
		});
	};
};
