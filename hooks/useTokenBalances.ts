import { useWeb3React } from '@web3-react/core';
import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { web } from 'webpack';
import { ERC20__factory } from '../generated/contracts';
import { OneInchGraph } from '../generated/OneInchGraph';
import { Store } from '../store/Store';

export const useTokenBalances = (
	provider: ethers.providers.Provider,
	tokens: OneInchGraph.Token[]
) => {
	const web3 = useWeb3React();
	const store = Store.useContext();
	const balances = store.state.data.walletsBalances[web3.account] || {};
	const loadTokenBalance = async (token: OneInchGraph.Token) => {
		let balance: BigNumber;
		if (balances[token.id]) {
			return balances[token.id];
		}
		if (token.symbol == 'ETH') {
			balance = await provider.getBalance(web3.account);
		} else {
			balance = await ERC20__factory.connect(token.id, provider).balanceOf(
				web3.account
			);
		}
		const rtnBalance = formatUnits(balance, BigNumber.from(token.decimals));
		store.dispatch('SetTokenBalanceForWallet', {
			tokenContractAddress: token.id,
			walletAddress: web3.account,
			formattedBalance: rtnBalance,
		});
		return rtnBalance;
	};
	useEffect(() => {
		if (!provider) return;
		if (!web3.account) return;
		tokens.forEach(async (t) => {
			loadTokenBalance(t).catch(console.error);
		});
	}, [web3.account, provider, tokens]);
	return balances || {};
};
