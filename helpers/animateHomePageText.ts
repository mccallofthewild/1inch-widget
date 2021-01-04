import anime from 'animejs';
export const animateHomePageText = async () => {
	const titleEl = document.getElementById('meet-bruce');
	const descriptionEl = document.getElementById('hero-description');
	const heroSwapEl = document.getElementById('hero-swap');
	const getStartedButton = document.getElementById('get-started-button');

	anime.set([heroSwapEl, titleEl, descriptionEl, getStartedButton], {
		opacity: 0,
	});

	await new Promise((r) => setTimeout(r, 0));
	const fx = {
		in: {
			duration: 900,
			delay: function (el, index) {
				return (index - 1) * 80;
			},
			easing: 'easeOutElastic',
			opacity: 1,
			translateY: function (el, index) {
				return index % 2 === 0 ? ['-80%', '0%'] : ['80%', '0%'];
			},
			rotateZ: [90, 0],
		},
		out: {
			opacity: 0,
			translateY: function (el, index) {
				return index % 2 === 0 ? '80%' : '-80%';
			},
			rotateZ: function (el, index) {
				return index % 2 === 0 ? -25 : 25;
			},
		},
	};
	const els = titleEl.children;
	let targets: Element[] = [];
	for (let el of els) {
		const spans = el.textContent.split('').map((l) => {
			const span = document.createElement('span');
			span.innerHTML = l;
			span.style.display = 'inline-block';
			return span;
		});
		el.innerHTML = '';

		spans.forEach((s) => el.appendChild(s));
		targets.push(...spans);
	}
	anime.set(targets, {
		...fx.out,
	});
	anime.set(titleEl, {
		opacity: 1,
	});

	await new Promise((r) => setTimeout(r, 1000));

	await anime({
		targets: targets,
		...fx.in,
		autoplay: true,
	}).finished;

	await Promise.all([
		anime({
			targets: [getStartedButton, descriptionEl],
			opacity: [0, 1],
			duration: 2000,
			easing: 'easeOutSine',
		}).finished,
		await anime({
			targets: heroSwapEl,
			duration: 2000,
			easing: 'easeOutCirc',
			translateY: [100, 0],
			opacity: [0, 1],
		}).finished,
	]);

	await anime({
		delay: 0,
		targets: document.getElementById('fist'),
		scale: [0, 20, 15, 0, 1],
		zIndex: 20,
		duration: 500,
	}).finished;
};
