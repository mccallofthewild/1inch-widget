import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { gql } from '../helpers/gql';
import { useCachedState } from './useCachedState';

let allTokensCached = [];
let complete = false;
export const useAllTokens = () => {
	const [allTokens, setAllTokens] = useCachedState<OneInchGraph.Token[]>(
		[],
		'allTokens'
	);
	let didUnmount = false;
	useEffect(() => {
		if (!allTokens.length) return;
		if (complete) {
			setAllTokens(allTokensCached);
			return;
		}
		(async () => {
			let interval = 20;
			let skip = 0;
			let lastResultCount = interval;
			do {
				const { tokens } = await gql`
					query Tokens($first: Int!, $skip: Int!) {
						tokens(
							first: $first
							skip: $skip
							orderBy: tradeCount
							orderDirection: desc
						) {
							id
							name
							symbol
							decimals
							tradeVolume
						}
					}
				`({
					first: interval,
					skip,
				});
				skip += interval;
				interval = 1000;
				lastResultCount = tokens.length;
				allTokensCached.push(...tokens);
				const allTokensUnique = [
					...new Set(allTokensCached.map((t) => t.symbol)),
				].map((symbol) => allTokensCached.find((t) => t.symbol == symbol));
				allTokensCached = allTokensUnique;
				if (!didUnmount) {
					setAllTokens([...allTokensUnique]);
				}
			} while (lastResultCount > 0);
			complete = true;
		})();
		return () => {
			didUnmount = true;
		};
	}, []);
	return allTokens;
};
