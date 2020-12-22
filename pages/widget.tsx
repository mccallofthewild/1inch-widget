import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { OneInchSwagger } from '../generated/OneInchSwagger';
import { Token, Tokens, TokensApi } from '../generated/openapi';
import { gql } from '../helpers/gql';
import { ethers } from 'ethers';
import { useDebounce } from '../helpers/useDebounce';

const cache = <T extends any>(
	name: string,
	loader: () => Promise<T>
): Promise<T> => {
	name = 'cache--' + name;
	const cached = localStorage.getItem(name);
	try {
		if (cached && JSON.parse(cached))
			return Promise.resolve(JSON.parse(cached));
	} catch (e) {}
	return loader().then((r) => {
		localStorage.setItem(name, JSON.stringify(r));
		return r;
	});
};

const widget = () => {
	const router = useRouter();
	const web3 = useWeb3React();

	const [widgetService] = useState(WidgetService.create());
	const [tradePairs, setTradePairs] = useState<OneInchGraph.TradingPair[]>([]);
	const [tokenTxs, setTokenTxs] = useState<{ contractAddress: string }[]>([]);
	const [fromToken, setFromToken] = useDebounce<Token | null>(null, 2000);
	const [toToken, setToToken] = useState<Token | undefined>();
	const [allTokens, setAllTokens] = useState<Token[]>([]);
	const [amountFromToken, setAmountFromToken] = useDebounce<number>(1, 2000);
	const [quote, setQuote] = useState<OneInchApi.Quote>();

	const activateWeb3 = async () => {
		await web3.activate(new InjectedConnector({}));
		localStorage.setItem('didActivateWeb3', '1');
	};
	useEffect(() => {
		if (localStorage.getItem('didActivateWeb3')) {
			activateWeb3();
		}
	}, []);
	useEffect(() => {
		cache('alltokens', () => new TokensApi().getTokens()).then(({ tokens }) => {
			setAllTokens([...Object.values(tokens)]);
		});
	}, []);
	useEffect(() => {
		if (!web3.account) return;
		cache('tokenTxs:' + web3.account, () =>
			fetch(
				`https://api.etherscan.io/api?module=account&action=tokentx&address=${web3.account}&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken`
			).then((r) => r.json())
		).then((r) => setTokenTxs(r.result));
	}, [web3.account]);
	useEffect(() => {
		if (!tokenTxs) return;
		const fromTokenAddresses = tokenTxs.map((tx) => tx.contractAddress);
		cache('tradePairs:' + fromTokenAddresses.join(','), () =>
			widgetService.loadTradePairsForToken({
				fromTokens: fromTokenAddresses,
				updateResponseData(data) {
					setTradePairs(data);
				},
			})
		).then(setTradePairs);
	}, [widgetService, tokenTxs]);
	useEffect(() => {
		if (![fromToken, toToken, web3.account].every((el) => !!el)) return;
		new OneInchApi.QuoteSwapApi()
			.getQuote({
				fromTokenAddress: fromToken.address,
				toTokenAddress: toToken.address,
				amount: parseInt(
					ethers.utils
						.parseUnits(
							amountFromToken.toString(),
							ethers.BigNumber.from(fromToken.decimals)
						)
						.toString()
				),
			})
			.then((quote) => {
				setQuote(quote);
			});
	}, [fromToken, toToken, web3.account, amountFromToken]);
	return (
		<div>
			<p>Account Address: {web3.account || 'Not Connected'}</p>
			{web3.account ? null : (
				<button onClick={() => activateWeb3()}>Connect Wallet</button>
			)}
			<select
				defaultValue='default'
				disabled={!tradePairs.length}
				onInput={(e) =>
					setFromToken(allTokens.find((t) => t.symbol == e.currentTarget.value))
				}
			>
				<option value='default'>
					{tradePairs.length ? 'From Token' : 'Loading...'}
				</option>
				<option value='ETH' key='ETH'>
					ETH
				</option>
				{[...new Set(allTokens)]
					.filter((t) => tokenTxs.some((tx) => tx.contractAddress == t.address))
					.map((token) => token.symbol)
					.map((symbol) => (
						<option value={symbol} key={symbol}>
							{symbol}
						</option>
					))}
			</select>
			<select
				disabled={!fromToken}
				defaultValue='toToken'
				onInput={(e) =>
					setToToken(allTokens.find((t) => t.symbol == e.currentTarget.value))
				}
			>
				<option value='toToken'>
					{tradePairs.length ? 'To Token' : 'Loading...'}
				</option>
				{[
					...new Set(
						(fromToken ? tradePairs : [])
							.filter((tp) => tp.fromToken.symbol == fromToken.symbol)
							.map((tp) => tp.toToken.symbol)
					),
				]
					.sort()
					.map((symbol) => (
						<option key={symbol}>{symbol}</option>
					))}
			</select>
			<label htmlFor='amount'>Amount to send</label>
			<input
				type='number'
				name='amount'
				defaultValue={amountFromToken}
				onInput={(e) => setAmountFromToken(parseFloat(e.currentTarget.value))}
			/>
			{/* {allTokens.map((t) => (
				<div key={t.address}>
					<img src={t.logoURI} alt={t.symbol} height='20' />
					<p>
						{t.symbol} - {t.name}
					</p>
				</div>
			))} */}
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
			<button>Swap!</button>
		</div>
	);
};
export default widget;

class WidgetService {
	static create() {
		return new this();
	}
	async loadTradePairsForToken({
		fromTokens,
		updateResponseData,
	}: {
		fromTokens: string[];
		updateResponseData: (
			data: OneInchGraph.Query['tradingPairs']
		) => any | void;
	}): Promise<OneInchGraph.Query['tradingPairs']> {
		const increment = 100;
		let skip = -increment;
		let allTradePairs = [];
		while (true) {
			skip += increment;
			const { tradingPairs } = await gql`
				query tokenPairs($fromToken_in: [String!], $skip: Int!, $first: Int!) {
					tradingPairs(
						skip: $skip
						first: $first
						orderBy: tradeCount
						orderDirection: desc
						where: {
							fromToken_in: $fromToken_in
							tradeVolume_gt: 0
							tradeCount_gt: 0
						}
					) {
						id
						tradeVolume
						fromToken {
							id
							name
							symbol
						}
						toToken {
							id
							name
							symbol
						}
					}
				}
			`({ fromToken_in: fromTokens, skip, first: increment });
			updateResponseData(allTradePairs);
			if (!tradingPairs.length) return allTradePairs;
			allTradePairs = [...allTradePairs, ...tradingPairs];
		}
	}
}
