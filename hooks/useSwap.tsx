import { useToasts } from '@geist-ui/react';
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
	const [toasts, setToast] = useToasts();
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
		const testMode = true && process.env.NODE_ENV == 'development';

		const signer = provider.getSigner();
		try {
			// Activate
			const parsedAmountFromToken = safeParseUnits(amountToSend, fromToken);

			// Approve
			if (fromToken.symbol != 'ETH') {
				try {
					setSwapStatus('AWAITING_APPROVAL');
					setToast({
						text: (
							<div>
								Please approve Bruce & 1inch <br />
								to spend your {fromToken.symbol}
							</div>
						),
						actions: [
							{
								name: 'Learn More',
								handler() {
									window.open(
										'https://help.1inch.exchange/en/articles/4585113-why-do-i-need-to-approve-my-tokens-before-a-trade',
										'_blank'
									);
								},
							},
						],
						delay: 5000,
					});
					if (!testMode) {
						const tx = await approve(
							parsedAmountFromToken,
							fromToken,
							provider
						);
						setSwapStatus('AWAITING_APPROVE_TX');
						if (tx) await waitForTx(tx.hash, provider);
						setToast({
							text: 'Approved!',
							delay: 5000,
						});
					} else {
						await new Promise((r) => setTimeout(r, 2000));
						setSwapStatus('AWAITING_APPROVE_TX');
						await new Promise((r) => setTimeout(r, 2000));
					}
				} catch (e) {
					setToast({
						text: 'Approval denied. Swap cancelled.',
						delay: 5000,
					});
					console.error(e);
					throw e;
				}
			}
			setSwapStatus('PREPARING_TX');

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
			// Add error toast here
			setData(swap);

			setSwapStatus('AWAITING_CONFIRMATION');
			let denied = false;
			await new Promise((resolve, reject) => {
				setConfirmState({ confirm: resolve, deny: reject });
			}).catch((e) => {
				setToast({
					text: 'Swap cancelled',
				});
				denied = true;
			});
			if (denied) {
				reset();
				return;
			}
			setToast({
				text: <div>Swap confirmed!</div>,
			});

			setTimeout(
				() =>
					setToast({
						text: <div>Please wait while Bruce swaps your tokens</div>,
						delay: 5000,
					}),
				1000
			);
			setSwapStatus('SENDING_TX');
			// Swap
			const {
				from,
				to,
				data,
				value,
				// gasPrice,
				// gas
			} = await swap.tx;

			if (!testMode) {
				const tx = await signer.sendTransaction({
					from,
					to,
					data,
					value: ethers.BigNumber.from(value),
				});
				await waitForTx(tx.hash, provider);
			} else {
				await new Promise((r) => setTimeout(r, 5000));
			}
			setToast({
				text: <div>Swap complete!</div>,
				delay: 1000,
			});
			setTimeout(
				() =>
					setToast({
						text: (
							<div>
								Converted{' '}
								{formatUnits(swap.fromTokenAmount, swap.fromToken.decimals)}{' '}
								{swap.fromToken.symbol} to <br />
								{formatUnits(swap.toTokenAmount, swap.toToken.decimals)}{' '}
								{swap.toToken.symbol}
							</div>
						),
						delay: 2000,
					}),
				1000
			);
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

	if (allowance.gte(parsedAmountFromToken)) {
		return;
	}

	// const amountNeeded = parsedAmountFromToken.sub(allowance);

	const tx = await erc20Contract.approve(spenderAddress, parsedAmountFromToken);
	return tx;
};
