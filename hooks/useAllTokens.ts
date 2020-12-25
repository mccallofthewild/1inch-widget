import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { gql } from '../helpers/gql';

export const useAllTokens = () => {
	const [allTokens, setAllTokens] = useState<OneInchGraph.Token[]>([]);
	useEffect(() => {
		(async () => {
			const allTokensTemp = [];
			let interval = 20;
			let skip = 0;
			let lastResultCount = interval;
			do {
				const { tokens } = await gql`
					query Tokens($first: Int!, $skip: Int!) {
						tokens(
							first: $first
							skip: $skip # orderBy: tradeCount # orderDirection: desc
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
				allTokensTemp.push(...tokens);
				const allTokensUnique = [
					...new Set(allTokensTemp.map((t) => t.symbol)),
				].map((symbol) => allTokensTemp.find((t) => t.symbol == symbol));
				setAllTokens([...allTokensUnique]);
			} while (lastResultCount > 0);
		})();
	}, []);
	return allTokens;
};
