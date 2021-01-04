import { useEffect } from 'react';

export const useNextTick = () => {
	const callbacks = [];
	useEffect(() => {
		setTimeout(() => {
			callbacks.forEach((cb) => cb());
		}, 1);
	});
	return () => {
		return new Promise<void>((r) => {
			callbacks.push(r);
		});
	};
};
