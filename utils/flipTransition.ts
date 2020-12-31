import anime from 'animejs';

export async function flipTransition(
	fromEl: HTMLElement,
	toEl: HTMLElement
): Promise<void> {
	// get initial positions (points that will be animated to and from)
	const initStart = fromEl.getBoundingClientRect();
	const end = toEl.getBoundingClientRect();
	// hide the end state
	toEl.style.opacity = '0';
	// show the start state
	fromEl.style.opacity = '1';
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
		});
		start = fromEl.getBoundingClientRect();
		anime.set(fromEl, {
			scaleX: 1,
			scaleY: 1,
		});
	}
	// move fromEl to be exactly on top of toEl
	await anime({
		targets: fromEl,
		scaleX,
		scaleY,
		// in the context of a rescaled element,
		// all related pixels are rescaled, so we
		// need to adjust the transforms accordingly
		translateY: (end.top - start.top) / scaleY,
		translateX: (end.left - start.left) / scaleX,
		duration: 1000,
		easing: 'easeInOutQuad',
	}).finished;
	// Reveal the actual element and hide the animated element
	toEl.style.opacity = '1';
	fromEl.style.opacity = '0';
	// Reset the animated element's transforms.
	anime.set(fromEl, {
		scaleX: 1,
		scaleY: 1,
		translateY: 0,
		translateX: 0,
	});
}
