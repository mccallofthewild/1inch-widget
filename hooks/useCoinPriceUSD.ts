import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { abbreviateNumber } from '../helpers/abbreviateNumber';
import { useAllTokens } from '../hooks/useAllTokens';
import { useQuote } from '../hooks/useQuote';
export const useCoinPriceUSD = (options: {
	token: OneInchGraph.Token;
	tokenQuantity: string;
}): string => {
	let { token, tokenQuantity } = options;

	const allTokens = useAllTokens();
	// DAI
	const stableCoinAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
	const quote = useQuote(
		tokenQuantity,
		token,
		useMemo(() => allTokens.find((t) => t.id == stableCoinAddress), [allTokens])
	);

	const price = useMemo(() => {
		if (!options.tokenQuantity || !options.token) return '';
		if (stableCoinAddress == token?.id) {
			return (+tokenQuantity).toFixed(2);
		}
		if (!quote) return '';
		const priceNum = (+formatUnits(
			BigNumber.from(quote.toTokenAmount),
			BigNumber.from(quote.toToken.decimals)
		)).toFixed(2);
		return priceNum;
	}, [quote, token, tokenQuantity]);

	return price;
};
