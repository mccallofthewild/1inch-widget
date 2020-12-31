import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { BigNumber, ethers } from 'ethers';
import { useDebounce } from '../hooks/useDebounce';
import { ERC20__factory } from '../generated/contracts';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { SelectToken } from '../components/SelectToken';
import { useAllTokens } from '../hooks/useAllTokens';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useWalletTokens } from '../hooks/useWalletTokens';
import { Button, Card, Col, Input, Row, Spacer, Text } from '@geist-ui/react';
import { CoinPriceUSD } from '../components/CoinPriceUSD';
import { useQuote } from '../hooks/useQuote';

const widget = () => {
	const router = useRouter();
	const web3 = useWeb3React();
	const allTokens = useAllTokens();
	const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
	const [fromToken, setFromToken] = useState<OneInchGraph.Token | null>(null);
	const [toToken, setToToken] = useState<OneInchGraph.Token | undefined>();
	const [amountToSend, setAmountToSend] = useDebounce<string | number>(1, 1000);
	const quote = useQuote(amountToSend + '', fromToken, toToken);
	const [swapStatus, setSwapStatus] = useState<
		'DORMANT' | 'SUCCESS' | 'PENDING' | 'FAILED'
	>();
	const fromTokens = useWalletTokens(provider);
	const fromTokenBalances = useTokenBalances(web3, provider, fromTokens);

	const activateWeb3 = async () => {
		const connector = new InjectedConnector({
			supportedChainIds: [
				1, // Mainnet
			],
		});
		await web3.activate(connector);
		setProvider(
			new ethers.providers.Web3Provider(await connector.getProvider())
		);
		localStorage.setItem('didActivateWeb3', '1');
	};
	useEffect(() => {
		if (!fromToken && !toToken && allTokens.length) {
			setFromToken(allTokens[0]);
			setToToken(allTokens[1]);
		}
	}, [fromToken, toToken, allTokens]);
	useEffect(() => {
		if (localStorage.getItem('didActivateWeb3')) activateWeb3();
	}, []);

	let amountInputRef: HTMLInputElement;
	useEffect(() => {
		const balance = fromTokenBalances[fromToken?.id];
		if (![fromToken, web3.account, balance, amountInputRef].every((el) => !!el))
			return;
		const val = formatUnits(balance, BigNumber.from(fromToken.decimals));
		amountInputRef.value = val;
		setAmountToSend(val);
	}, [fromToken]);

	return (
		<div style={{ margin: 30 }}>
			<Card shadow>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div>
						{' '}
						{web3.account ? null : (
							<Button onClick={() => activateWeb3()}>Connect Wallet</Button>
						)}
					</div>
					{fromToken ? (
						<>
							<Text h5>Amount to send</Text>
							<Input
								type='number'
								name='amount'
								min='0'
								labelRight={fromToken.symbol}
								ref={(ref) => {
									amountInputRef = ref;
								}}
								max={
									fromTokenBalances[fromToken.id]
										? parseFloat(
												formatUnits(
													fromTokenBalances[fromToken.id],
													fromToken.decimals
												)
										  )
										: Infinity
								}
								defaultValue={amountToSend}
								onChange={(e) =>
									setAmountToSend(parseFloat(e.currentTarget.value))
								}
							/>
						</>
					) : null}
					<Spacer></Spacer>
					<SelectToken
						label='From Token'
						onInput={(t) => setFromToken(t)}
						tokens={fromTokens}
					></SelectToken>
					{fromToken ? (
						<Text small b>
							Balance of{' '}
							{fromTokenBalances[fromToken.id]
								? formatUnits(
										fromTokenBalances[fromToken.id],
										fromToken.decimals
								  )
								: null}{' '}
							{fromToken.symbol}
						</Text>
					) : null}
					<Spacer></Spacer>
					<SelectToken
						label='To Token'
						onInput={(t) => {
							setToToken(t);
						}}
						tokens={allTokens.filter((t) => t.id != fromToken?.id)}
					></SelectToken>
					<Spacer></Spacer>

					<CoinPriceUSD
						tokenAddress={fromToken?.id}
						tokenQuantity={amountToSend + ''}
					></CoinPriceUSD>
					{quote ? (
						<p>
							{ethers.utils
								.formatUnits(
									ethers.BigNumber.from(quote.fromTokenAmount),
									ethers.BigNumber.from(quote.fromToken.decimals)
								)
								.toString()}{' '}
							{quote.fromToken.symbol} for{' '}
							{ethers.utils
								.formatUnits(
									ethers.BigNumber.from(quote.toTokenAmount),
									ethers.BigNumber.from(quote.toToken.decimals)
								)
								.toString()}{' '}
							{quote.toToken.symbol}
						</p>
					) : null}

					<Button
						loading={swapStatus == 'PENDING'}
						type={
							swapStatus == 'SUCCESS'
								? 'success'
								: swapStatus == 'FAILED'
								? 'warning'
								: 'secondary'
						}
						shadow
						onClick={() => swapTokens()}
						size={'large'}
					>
						Swap!
					</Button>
				</div>
			</Card>
		</div>
	);
};
export default widget;
