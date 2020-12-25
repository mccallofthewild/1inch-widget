import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';

export const useFromTokens = (
	tokenTxs: { contractAddress }[],
	allTokens: OneInchGraph.Token[]
) => {
	const [state, setState] = useState<OneInchGraph.Token[]>([]);
	useEffect(() => {
		setState(
			allTokens.filter(
				(t) =>
					t.symbol == 'ETH' ||
					tokenTxs.find(
						(tx) => tx.contractAddress.toLowerCase() == t.id.toLowerCase()
					)
			)
		);
	}, [tokenTxs, allTokens]);
	return state;
};
