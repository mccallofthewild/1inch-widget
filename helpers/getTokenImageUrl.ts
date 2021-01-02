import { OneInchGraph } from '../generated/OneInchGraph';

export const getTokenImageUrl = (token: OneInchGraph.Token) =>
	`https://tokens.1inch.exchange/${
		token?.symbol == 'ETH'
			? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
			: token?.id
	}.png`;
