import { OneInchGraph } from '../generated/OneInchGraph';
import { gql } from '../helpers/gql';

export const loadAllTokens = async (
	params: {
		onUpdate?: (tokens: OneInchGraph.Token[]) => any;
	} = {
		onUpdate: (t) => {},
	}
) => {
	let interval = 20;
	let skip = 0;
	let lastResultCount = interval;
	let allTokens: OneInchGraph.Token[] = [];
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

		allTokens.push(...tokens);
		const allTokensUnique = [
			...new Set(allTokens.map((t) => t.symbol)),
		].map((symbol) => allTokens.find((t) => t.symbol == symbol));
		allTokens = allTokensUnique;
	} while (lastResultCount > 0);
	return allTokens;
};
