import anime, { EasingOptions } from 'animejs';

export async function replaceTransition(
	fromEl: HTMLElement,
	toEl: HTMLElement
): Promise<void> {
	// get initial positions (points that will be animated to and from)
	const initStart = fromEl.getBoundingClientRect();
	const end = toEl.getBoundingClientRect();

	let start = initStart;
	const scaleX = end.width / initStart.width;
	const scaleY = end.height / initStart.height;
	// if scaling is needed
	if (initStart.width != end.width || initStart.height != end.height) {
		// use the bounding box for the element at full scale
		// (this runs synchronously, so no visible UI update occurs)
		anime.set(fromEl, {
			scaleX: scaleX,
			scaleY: scaleY,
			'pointer-events': 'none',
		});
		start = fromEl.getBoundingClientRect();
		anime.set(fromEl, {
			scaleX: 1,
			scaleY: 1,
		});
	}
	const easing: EasingOptions = 'easeInOutCirc';
	// move fromEl to be exactly on top of toEl
	await anime({
		targets: fromEl,
		scaleX,
		scaleY,
		easing: easing,
		// in the context of a rescaled element,
		// all related pixels are rescaled, so we
		// need to adjust the transforms accordingly
		translateY: (end.top - start.top) / scaleY,
		translateX: (end.left - start.left) / scaleX,
		duration: 550,
	}).finished;
	// Reveal the actual element and hide the animated element
	toEl.style.opacity = '1';
	// fromEl.style.opacity = '0';
	// Reset the animated element's transforms.
	anime.set(fromEl, {
		scaleX: 1,
		scaleY: 1,
		translateY: 0,
		translateX: 0,
		'pointer-events': 'all',
	});
}
