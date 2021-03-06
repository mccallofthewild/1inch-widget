export function getGradients() {
	// from https://gradients.cssgears.com/collections/6Z6bGmXNE0SlCiRG
	const gradients = [
		'linear-gradient(135deg, rgb(240, 123, 64) 0%, rgb(223, 91, 162) 100%)',
		'linear-gradient(135deg, rgb(94, 37, 99) 0%, rgb(101, 120, 155) 100%)',
		'linear-gradient(135deg, rgb(234, 90, 110) 0%, rgb(222, 120, 29) 100%)',
		'linear-gradient(135deg, rgb(91, 39, 116) 0%, rgb(51, 91, 197) 100%)',
		'linear-gradient(135deg, rgb(232, 68, 138) 0%, rgb(144, 54, 117) 100%)',
		'linear-gradient(135deg, rgb(65, 233, 116) 0%, rgb(40, 152, 173) 100%)',
		'linear-gradient(135deg, rgb(39, 97, 116) 0%, rgb(51, 197, 142) 100%)',
		'linear-gradient(135deg, rgb(136, 41, 173) 0%, rgb(66, 106, 172) 100%)',
		'linear-gradient(135deg, rgb(253, 160, 0) 0%, rgb(211, 31, 138) 100%)',
		'linear-gradient(135deg, rgb(39, 75, 116) 0%, rgb(130, 51, 197) 100%)',
		'linear-gradient(135deg, rgb(116, 39, 108) 0%, rgb(197, 51, 100) 100%)',
		'linear-gradient(135deg, rgb(27, 206, 222) 0%, rgb(91, 36, 121) 100%)',
		'linear-gradient(135deg, rgb(87, 201, 132) 0%, rgb(24, 78, 104) 100%)',
		'linear-gradient(135deg, rgb(239, 47, 193) 0%, rgb(96, 148, 234) 100%)',
		'linear-gradient(135deg, rgb(66, 229, 149) 0%, rgb(58, 178, 184) 100%)',
		'linear-gradient(135deg, rgb(113, 22, 234) 0%, rgb(234, 96, 96) 100%)',
		'linear-gradient(135deg, rgb(97, 39, 116) 0%, rgb(197, 51, 100) 100%)',
		'linear-gradient(135deg, rgb(22, 234, 216) 0%, rgb(96, 119, 234) 100%)',
		'linear-gradient(135deg, rgb(255, 118, 118) 0%, rgb(245, 78, 162) 100%)',
		'linear-gradient(135deg, rgb(252, 227, 138) 0%, rgb(243, 129, 129) 100%)',
	];
	return {
		gradients,
		random() {
			return gradients[~~(gradients.length * Math.random())];
		},
	};
}
