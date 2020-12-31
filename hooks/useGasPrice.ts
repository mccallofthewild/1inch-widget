import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { calc } from '../helpers/calc';

export const useGasPrice = () => {
	const [lastUpdate, setLastUpdate] = useState(-Infinity);
	const [state, setState] = useState<string>();
	if (Date.now() - lastUpdate > 1000 * 30) {
		setLastUpdate(Date.now());
		ethers
			.getDefaultProvider()
			.getGasPrice()
			.then((gp) => setState(calc`${formatUnits(gp, 'gwei')}`));
	}
	return state;
};
