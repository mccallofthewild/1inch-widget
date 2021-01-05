import { Ref, useEffect, useMemo, useState } from 'react';

export const useInfiniteScroll = <T>(
	data: T[],
	itemHeight: number,
	scrollEl: HTMLElement | null
) => {
	const [state, setState] = useState<{
		visibleItems: T[];
		padTop: number;
		padBottom: number;
	}>({
		visibleItems: [],
		padTop: 0,
		padBottom: 0,
	});
	let initialRenderedCount = useMemo(
		() => (scrollEl ? Math.ceil(scrollEl.clientHeight / itemHeight) || 20 : 0),
		[!!scrollEl]
	);
	useEffect(() => {
		if (!scrollEl) return;
		let startIndex = 0,
			endIndex = initialRenderedCount;
		const itemPadMod = 3;
		const listener = () => {
			startIndex = Math.max(
				// how many items "rendered" above
				Math.floor(scrollEl.scrollTop / itemHeight) -
					Math.floor((initialRenderedCount * itemPadMod) / 2),
				0
			);
			endIndex = Math.min(
				startIndex + initialRenderedCount * itemPadMod * 2,
				data.length - 1
			);
			const visible = data.slice(startIndex, endIndex + 1);
			const state = {
				visibleItems: visible,
				padTop: startIndex * itemHeight,
				padBottom: Math.max(
					(data.length - endIndex + initialRenderedCount / 2) * itemHeight,
					0
				),
			};
			setState(state);
		};
		listener();
		scrollEl.addEventListener('scroll', listener);
		return () => scrollEl.removeEventListener('scroll', listener);
	}, [scrollEl, data, data.length]);
	useEffect(() => {
		if (scrollEl) scrollEl.scrollTop = 0;
	}, [data]);
	return state;
};
