import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export const useTokenTxsFromAccount = (
	web3: Web3ReactManagerReturn,
	provider: ethers.providers.Provider
) => {
	const [state, setState] = useState<{ contractAddress: string }[]>([]);
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
				setState(logs.map((l) => ({ contractAddress: l.address })));
			});
	}, [web3.account, provider]);
	return state;
};
