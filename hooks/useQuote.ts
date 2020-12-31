import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { calc } from '../helpers/calc';
import { repeatOnFail } from '../helpers/repeatOnFail';
import { safeParseUnits } from '../helpers/safeParseUnits';
import { useAsyncStateInOrder } from './useAsyncStateInOrder';

// failing at 0.004124080688091229 ETH -> DAI
export const useQuote = (
	amountToSend: string,
	fromToken?: OneInchGraph.Token,
	toToken?: OneInchGraph.Token
): OneInchApi.Quote | null => {
	const [state, setState, clear] = useAsyncStateInOrder<OneInchApi.Quote>(null);

	let didUnmount = false;
	useEffect(() => {
		setState(null);
		clear();
		if (
			fromToken?.id == toToken?.id ||
			![fromToken, toToken, amountToSend].every((el) => !!el)
		) {
			return;
		}

		repeatOnFail(
			async () =>
				await new OneInchApi.QuoteSwapApi().getQuote({
					fromTokenAddress: fromToken.id,
					toTokenAddress: toToken.id,
					amount: (safeParseUnits(
						amountToSend,
						fromToken
					).toString() as unknown) as number,
				}),
			{
				iterations: 5,
				waitFor: 1000,
			}
		)
			.then((quote) => {
				if (!didUnmount) setState(quote);
			})
			.catch((e) => {
				console.error(e);
				if (!didUnmount) setState(null);
			});
		return () => {
			didUnmount = true;
		};
	}, [fromToken, toToken, amountToSend]);
	return state;
};
