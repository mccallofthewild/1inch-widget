import { ethers } from 'ethers';
import { OneInchGraph } from '../generated/OneInchGraph';

export const safeParseUnits = (
	tokenQuantity: string,
	fromToken: OneInchGraph.Token
) => {
	if (!tokenQuantity) return ethers.BigNumber.from('0');
	let [intToSend, decimalsToSend] = tokenQuantity.split('.');
	if (decimalsToSend && decimalsToSend.length > fromToken.decimals) {
		decimalsToSend = decimalsToSend.slice(0, fromToken.decimals);
		if (decimalsToSend.length)
			tokenQuantity = [intToSend, decimalsToSend].join('.');
		else tokenQuantity = intToSend;
	}
	return ethers.utils.parseUnits(
		// Formats number to prevent error
		tokenQuantity,
		ethers.BigNumber.from(fromToken.decimals)
	);
};
