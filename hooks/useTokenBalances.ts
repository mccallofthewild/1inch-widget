import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { ERC20__factory } from '../generated/contracts';
import { OneInchGraph } from '../generated/OneInchGraph';

export const useTokenBalances = (
	web3: Web3ReactManagerReturn,
	provider: ethers.providers.Provider,
	tokens: OneInchGraph.Token[]
) => {
	const [state, setState] = useState<{ [key: string]: BigNumber }>({});
	const loadTokenBalance = async (token: OneInchGraph.Token) => {
		let balance: BigNumber;
		if (token.symbol == 'ETH') {
			balance = await provider.getBalance(web3.account);
		} else {
			balance = await ERC20__factory.connect(token.id, provider).balanceOf(
				web3.account
			);
		}
		return balance;
	};
	useEffect(() => {
		if (!web3.account) return;
		let tokenBalances = {};
		tokens.forEach(async (t) => {
			loadTokenBalance(t)
				.then(async (b) => {
					tokenBalances = {
						...state,
						...tokenBalances,
						[t.id]: await loadTokenBalance(t),
					};
					setState(tokenBalances);
				})
				.catch(console.error);
		});
	}, [web3.account, provider, tokens]);
	return state;
};
