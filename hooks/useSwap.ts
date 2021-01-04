import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { web } from 'webpack';
import { ERC20__factory } from '../generated/contracts';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { repeatOnFail } from '../helpers/repeatOnFail';
import { safeParseUnits } from '../helpers/safeParseUnits';

type SwapStatus =
	| 'DORMANT'
	| 'PREPARING_TX'
	| 'AWAITING_CONFIRMATION'
	| 'AWAITING_APPROVAL'
	| 'AWAITING_APPROVE_TX'
	| 'SENDING_TX'
	| 'COMPLETE'
	| 'ERROR';
export const useSwap = (
	amountToSend: string,
	fromToken: OneInchGraph.Token,
	toToken: OneInchGraph.Token,
	provider: ethers.providers.Web3Provider
): {
	status: SwapStatus;
	data: OneInchApi.Swap;
	execute: Function;
	confirmSwap: Function;
	denySwap: Function;
	reset: Function;
} => {
	const web3 = useWeb3React();
	const [swapStatus, setSwapStatus] = useState<SwapStatus>('DORMANT');
	const [data, setData] = useState<OneInchApi.Swap>();
	const [confirmState, setConfirmState] = useState<{
		confirm: Function;
		deny: Function;
	}>({ confirm: () => {}, deny: () => {} });
	const reset = () => {
		setData(null);
		setSwapStatus('DORMANT');
		setConfirmState({ confirm: () => {}, deny: () => {} });
	};
	const execute = async () => {
		const signer = provider.getSigner();
		try {
			setSwapStatus('PREPARING_TX');
			// Activate
			const parsedAmountFromToken = safeParseUnits(amountToSend, fromToken);

			// Approve
			if (fromToken.symbol != 'ETH') {
				setSwapStatus('AWAITING_APPROVAL');
				const tx = await approve(parsedAmountFromToken, fromToken, provider);
				setSwapStatus('AWAITING_APPROVE_TX');
				if (tx) await waitForTx(tx.hash, provider);
			}

			const swap = await repeatOnFail(
				async () =>
					await await new OneInchApi.QuoteSwapApi().swap({
						fromTokenAddress: fromToken.id,
						toTokenAddress: toToken.id,
						amount: (parsedAmountFromToken.toString() as unknown) as number,
						slippage: 1,
						fromAddress: web3.account,
					}),
				{
					waitFor: 1000,
					iterations: 5,
				}
			);
			setData(swap);

			setSwapStatus('AWAITING_CONFIRMATION');
			let denied = false;
			await new Promise((resolve, reject) => {
				setConfirmState({ confirm: resolve, deny: reject });
			}).catch((e) => {
				denied = true;
			});
			if (denied) {
				reset();
				return;
			}

			setSwapStatus('SENDING_TX');
			if (false) {
				// UI DEV MODE (Skip Transactions)
			} else {
				// Swap
				const {
					from,
					to,
					data,
					value,
					// gasPrice,
					// gas
				} = await swap.tx;
				const tx = await signer.sendTransaction({
					from,
					to,
					data,
					value: ethers.BigNumber.from(value),
				});
				await waitForTx(tx.hash, provider);
			}
			setSwapStatus('COMPLETE');
		} catch (e) {
			setSwapStatus('ERROR');
			console.error(e);
		}
	};
	return {
		execute,
		data,
		status: swapStatus,
		confirmSwap: confirmState.confirm,
		denySwap: confirmState.deny,
		reset,
	};
};

const waitForTx = async (
	txHash: string,
	provider: ethers.providers.Web3Provider
) => {
	while (true) {
		const receipt = await provider.getTransactionReceipt(txHash);
		if (receipt) {
			break;
		} else console.log({ receipt });
		await new Promise((r) => setTimeout(r, 5000));
	}
};

const approve = async (
	parsedAmountFromToken: BigNumber,
	fromToken: OneInchGraph.Token,
	provider: ethers.providers.Web3Provider
) => {
	const signer = provider.getSigner();
	const erc20Contract = await ERC20__factory.connect(fromToken.id, signer);
	const {
		address: spenderAddress,
	} = await new OneInchApi.ApproveApi().getSpenderAddress();

	const allowance = await erc20Contract.allowance(
		await signer.getAddress(),
		spenderAddress
	);

	// console.log({ allowance: formatUnits(allowance, fromToken.decimals) });

	if (allowance.gte(parsedAmountFromToken)) {
		console.log('allowance is adequate');
		return;
	}

	// const amountNeeded = parsedAmountFromToken.sub(allowance);

	const tx = await erc20Contract.approve(spenderAddress, parsedAmountFromToken);
	return tx;
};
