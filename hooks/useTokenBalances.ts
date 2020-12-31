import { useWeb3React } from '@web3-react/core';
import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { web } from 'webpack';
import { ERC20__factory } from '../generated/contracts';
import { OneInchGraph } from '../generated/OneInchGraph';

const cache = {};
export const useTokenBalances = (
	provider: ethers.providers.Provider,
	tokens: OneInchGraph.Token[]
) => {
	const web3 = useWeb3React();
	const [state, setState] = useState<{ [key: string]: string }>({});
	const loadTokenBalance = async (token: OneInchGraph.Token) => {
		let balance: BigNumber;
		if (cache[web3.account + token.id]) {
			return cache[web3.account + token.id];
		}
		if (token.symbol == 'ETH') {
			balance = await provider.getBalance(web3.account);
		} else {
			balance = await ERC20__factory.connect(token.id, provider).balanceOf(
				web3.account
			);
		}
		const rtnBalance = formatUnits(balance, BigNumber.from(token.decimals));
		cache[web3.account + token.id] = rtnBalance;
		return rtnBalance;
	};
	useEffect(() => {
		if (!provider) return;
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
