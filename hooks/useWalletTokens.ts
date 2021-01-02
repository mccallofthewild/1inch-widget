import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useAllTokens } from './useAllTokens';

export const useWalletTokens = (provider: ethers.providers.Web3Provider) => {
	const allTokens = useAllTokens();
	const web3 = useWeb3React();
	const [state, setState] = useState<ethers.providers.Log[]>([]);
	useEffect(() => {
		if (!web3.account || !provider) return;
		provider
			.getLogs({
				address: null,
				fromBlock: 0,
				toBlock: 'latest',
				topics: [
					null,
					null,
					web3.account.replace('0x', '0x000000000000000000000000'),
				],
			})
			.then((logs) => {
				setState(logs);
			});
	}, [web3.account, provider]);

	return useMemo(() => {
		const logAddresses = state.map((l) => l.address.toLowerCase()).join('---');
		return allTokens.filter(
			(t) =>
				t.symbol == 'ETH' ||
				state.find((tx) => logAddresses.includes(t.id.toLowerCase()))
		);
	}, [allTokens, state]);
};
