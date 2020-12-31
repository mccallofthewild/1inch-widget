export function abbreviateNumber(value) {
	let newValue = +value;
	const suffixes = ['', 'K', 'M', 'B', 'T'];
	let suffixNum = 0;
	while (newValue >= 1000) {
		newValue /= 1000;
		suffixNum++;
	}

	let result = newValue.toPrecision(3);

	result += suffixes[suffixNum];
	return result;
}
