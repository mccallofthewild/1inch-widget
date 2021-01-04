import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { calc } from '../helpers/calc';
import { useAllTokens } from '../hooks/useAllTokens';
import { useGasPrice } from '../hooks/useGasPrice';
import { useQuote } from '../hooks/useQuote';
import { useSwap } from '../hooks/useSwap';
import styles from '../styles/swap.module.css';
import utilStyles from '../styles/utils.module.css';
import { TokenSearch } from './TokenSearch';
import { InjectedConnector } from '@web3-react/injected-connector';
import { replaceTransition } from '../utils/replaceTransition';
import { rateLimitContractsAndOneInch } from '../helpers/rateLimitContractsAndOneInch';
import { SwapToken } from './SwapToken';
import { useDebounce } from '../hooks/useDebounce';
import { Spinner, useToasts } from '@geist-ui/react';
import { CoinPriceUSD } from './CoinPriceUSD';
import { useCoinPriceUSD } from '../hooks/useCoinPriceUSD';
import { LoadingText } from './LoadingText';
import { SwapStageConfirm } from './SwapStageConfirm';
import Lottie from 'react-lottie';
import moneyAnimation from '../assets/animations/money.lottie.json';
import signingAnimation from '../assets/animations/signing.lottie.json';
import approveAnimation from '../assets/animations/approve.lottie.json';
import { CSSTransition } from 'react-transition-group';
import anime from 'animejs';
import { NoFragmentCyclesRule } from 'graphql';
import { useWalletTokens } from '../hooks/useWalletTokens';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { ArrowDown, RefreshCcw } from '@geist-ui/react-icons';
import { Store } from '../contexts/Store';
import { StringDecoder } from 'string_decoder';
import { Touchable } from '../components/Touchable';
import { useNextTick } from '../hooks/useNextTick';
import { SwapModal } from './SwapModal';

rateLimitContractsAndOneInch();

let hasCheckedForEthereum = false;
export const Swap = (props: {
	allTokens?: OneInchGraph.Token[];
	staticToTokenSymbol?: string;
}) => {
	const alertIfNoWeb3 = () => {
		// @ts-ignore
		if (process.browser && !window.ethereum)
			setToast({
				text: 'Web3 provider not detected',
				delay: 10000,
				actions: [
					{
						name: 'Download Metamask',
						handler: () =>
							window.open('https://metamask.io/download.html', '_blank'),
					},
				],
			});
	};

	const allTokens = useAllTokens(props.allTokens);
	const [fromToken, setFromToken] = useState<OneInchGraph.Token>();
	const [toToken, setToToken] = useState<OneInchGraph.Token>();
	const [quantity, setQuantity] = useState<string>('1');
	const [output, setOutput] = useState<string>('');
	const gasPrice = useGasPrice();
	const quote = useQuote(quantity, fromToken, toToken);
	const web3 = useWeb3React();
	const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
	const [searchState, setSearchState] = useState<{
		onSelect: typeof setFromToken | typeof setToToken;
		isVisible: boolean;
		filter: (t: OneInchGraph.Token) => boolean;
	}>({ onSelect: () => {}, isVisible: false, filter: () => false });
	const swapState = useSwap(quantity, fromToken, toToken, provider);
	const walletTokens = useWalletTokens(provider);
	const walletTokenBalances = useTokenBalances(provider, walletTokens);
	const [toasts, setToast] = useToasts();
	const refreshIconRef = useRef<HTMLDivElement>();
	const arrowIconRef = useRef<HTMLDivElement>();
	const dividerRef = useRef<HTMLDivElement>();
	const nextTick = useNextTick();

	const activateWeb3 = async () => {
		try {
			const connector = new InjectedConnector({
				supportedChainIds: [
					1, // Mainnet
				],
			});
			await web3.activate(connector, (e) => {
				// alert(e.message);
				alertIfNoWeb3();
			});
			setProvider(
				new ethers.providers.Web3Provider(await connector.getProvider())
			);
			localStorage.setItem('didActivateWeb3', '1');
		} catch (e) {
			console.error(e);
		}
	};
	useEffect(() => {
		if (localStorage.getItem('didActivateWeb3')) activateWeb3();
	}, []);
	useEffect(() => {
		if (!!quote)
			setOutput(
				formatUnits(
					BigNumber.from(quote.toTokenAmount),
					BigNumber.from(quote.toToken.decimals)
				)
			);
		else {
			setOutput('');
		}
	}, [quote?.toTokenAmount, quote?.toToken.decimals]);
	useEffect(() => {
		if (!fromToken && !toToken && allTokens.length) {
			setFromToken(allTokens[0]);
			setToToken(allTokens[1]);
		}
	}, [fromToken, toToken, allTokens]);

	useEffect(() => {
		if (!props.staticToTokenSymbol) return;
		let token = allTokens.find((t) => t.symbol == props.staticToTokenSymbol);
		if (token) setToToken(token);
	}, [props.staticToTokenSymbol, allTokens]);

	const tokenSearchRef = useRef<HTMLDivElement>();
	if (swapState.status == 'PREPARING_TX') {
		return (
			<div className={styles.swap_container}>
				<div className={styles.swap_header}>
					<div
						className={[
							styles.swap_header_item,
							styles.swap_header_item_active,
						].join(' ')}
					>
						PREPARING SWAP
					</div>
				</div>
				<Spinner></Spinner>
				<div></div>
			</div>
		);
	}

	if (swapState.status == 'AWAITING_CONFIRMATION') {
		return (
			<SwapStageConfirm
				swap={swapState.data}
				fromToken={fromToken}
				confirm={swapState.confirmSwap}
				deny={swapState.denySwap}
			></SwapStageConfirm>
		);
	}
	if (
		swapState.status == 'AWAITING_APPROVAL' ||
		swapState.status == 'AWAITING_APPROVE_TX'
	) {
		return (
			<div className={styles.swap_container}>
				<div className={styles.swap_header}>
					<div
						className={[
							styles.swap_header_item,
							styles.swap_header_item_active,
						].join(' ')}
					>
						{swapState.status == 'AWAITING_APPROVAL'
							? 'APPROVE'
							: swapState.status == 'AWAITING_APPROVE_TX'
							? 'APPROVING...'
							: ''}
					</div>
				</div>
				<Lottie
					options={{
						autoplay: true,
						animationData: approveAnimation,
					}}
				></Lottie>
				<div></div>
			</div>
		);
	}
	if (swapState.status == 'SENDING_TX') {
		return (
			<div className={styles.swap_container}>
				<div className={styles.swap_header}>
					<div
						className={[
							styles.swap_header_item,
							styles.swap_header_item_active,
						].join(' ')}
					>
						SWAPPING TOKENS
					</div>
				</div>
				<Lottie
					options={{
						autoplay: true,
						animationData: signingAnimation,
					}}
				></Lottie>{' '}
			</div>
		);
	}
	if (swapState.status == 'COMPLETE') {
		return (
			<div className={styles.swap_container}>
				<div className={styles.swap_header}>
					<div
						className={[
							styles.swap_header_item,
							styles.swap_header_item_active,
						].join(' ')}
					>
						COMPLETE
					</div>
				</div>
				<Lottie
					options={{
						autoplay: true,
						animationData: moneyAnimation,
					}}
				></Lottie>
				<div className={utilStyles.button_group}>
					<button
						onClick={() => swapState.reset()}
						className={utilStyles.button}
					>
						Swap Again
					</button>
				</div>
			</div>
		);
	}
	let isAnimatingTokenSwitch = false;
	return (
		<form
			onInvalid={() => {
				setToast({
					text: 'Insufficient funds',
				});
			}}
			onSubmit={(e) => {
				e.preventDefault();
				if (!web3.account) return;
				if (+quantity > +(walletTokenBalances[fromToken.id] || 0)) {
					setToast({
						text: `Insufficient ${fromToken.symbol} balance`,
					});
					return;
				}
				return swapState.execute();
			}}
			className={styles.swap_container}
		>
			<div style={{ height: '100%', width: '100%', position: 'relative' }}>
				<div className={styles.swap_header}>
					{/* <div
					className={[
						styles.swap_header_item,
						styles.swap_header_item_active,
					].join(' ')}
				>
					SWAP
				</div> */}
					<div>
						<a target='_blank' href='/'>
							{' '}
							<img height='26.97px' src='./images/bruce.svg' alt='logo' />
						</a>
						<div
							style={{
								fontSize: '9px',
								color: '#979797',
								textAlign: 'center',
							}}
						>
							via{' '}
							<a
								style={{ color: '#979797' }}
								target='_blank'
								href='https://1inch.exchange'
							>
								1inch.exchange
							</a>
						</div>
					</div>
					{/* <div className={styles.swap_header_item}>INFO</div> */}
				</div>
				<div className={styles.swap_form_container}>
					<SwapToken
						hasBalance={!!walletTokens.find((t) => t.id == fromToken?.id)}
						onClickToChangeToken={() => {
							setSearchState({
								isVisible: true,
								onSelect: (t) => {
									setQuantity('1');
									setFromToken(t);
								},
								filter: (t) => true,
								// filter: (t) => t.id != toToken.id,
							});
						}}
						quantity={quantity}
						setQuantity={setQuantity}
						token={fromToken}
						walletBalance={walletTokenBalances[fromToken?.id]}
					></SwapToken>
					<div className={styles.swap_form_token_divider_container}>
						<div
							style={{ paddingTop: 5, marginRight: '10px', marginLeft: '7px' }}
							className={styles.swap_form_token_divider_action_icon}
							ref={arrowIconRef}
						>
							<ArrowDown size={22} color={'rgba(0, 0, 0, 0.25)'}></ArrowDown>
						</div>
						{/* <OneInchLogo></OneInchLogo> */}
						<div
							ref={dividerRef}
							className={styles.swap_form_token_divider}
						></div>
						<div
							onClick={async () => {
								if (!(toToken && fromToken) || isAnimatingTokenSwitch) return;
								const fromTokenEl = document.getElementById(
									'token--' + fromToken.symbol
								);
								const toTokenEl = document.getElementById(
									'token--' + toToken.symbol
								);
								isAnimatingTokenSwitch = true;

								const rotateIconAnim = anime({
									targets: refreshIconRef.current.querySelector('svg'),
									rotate: ['360deg', '-3600deg'],
									scale: [1, 0.8, 0.1, 1.2, 1],
									duration: 500,
									easing: 'easeInOutSine',
								}).play();
								const arrowIconAnim = anime({
									targets: arrowIconRef.current.querySelector('svg'),
									rotate: ['0deg', '-360deg'],
									duration: 500,
									easing: 'easeInOutSine',
								}).play();
								anime.set(dividerRef.current, {
									transformOrigin: 'center center',
								});
								anime({
									targets: dividerRef.current,
									scale: [1, 0.2, 1],
									duration: 700,
									easing: 'easeOutSine',
								}).play();
								await Promise.all([
									replaceTransition(fromTokenEl, toTokenEl),
									replaceTransition(toTokenEl, fromTokenEl),
								]);
								setFromToken(toToken);
								setToToken(fromToken);
								setOutput('');
								isAnimatingTokenSwitch = false;
								if (quote) {
									try {
										if (quote.toToken.symbol != toToken.symbol) {
											throw 'wrong token. new output not loaded yet. set to default';
										}
										formatUnits(
											BigNumber.from(quote.toTokenAmount),
											BigNumber.from(quote.toToken.decimals)
										);
										setQuantity(
											(+formatUnits(
												BigNumber.from(quote.toTokenAmount),
												BigNumber.from(quote.toToken.decimals)
											)).toPrecision(quote.fromToken.decimals)
										);
										// formatUnits(BigNumber.from(quote.fromTokenAmount), BigNumber.from(quote.fromToken.decimals))
										// setQuantity(
										// 	formatUnits(parseUnits(output, fromToken.))
										// );
									} catch (e) {
										setQuantity('1');
									}
								}
							}}
							style={{
								cursor: 'pointer',
								marginLeft: '15px',
								marginTop: '8px',
								...(props.staticToTokenSymbol
									? {
											opacity: 0,
											pointerEvents: 'none',
									  }
									: {}),
							}}
							className={styles.swap_form_token_divider_action_icon}
							ref={refreshIconRef}
						>
							{/* Refresh Icon */}
							<RefreshCcw size={20}></RefreshCcw>
						</div>
					</div>
					<SwapToken
						isStatic={
							!!props.staticToTokenSymbol &&
							toToken?.symbol == props.staticToTokenSymbol
						}
						hasBalance={!!walletTokens.find((t) => t.id == toToken?.id)}
						loading={!output}
						onClickToChangeToken={() => {
							setSearchState({
								isVisible: true,
								onSelect: (t) => {
									setToToken(t);
								},
								filter: (t) => t.id != fromToken.id,
							});
						}}
						quantity={output}
						token={toToken}
						readonly={true}
					></SwapToken>
					<div className={styles.swap_form_token_dex_info_container}>
						<div className={styles.swap_form_token_dex_info_title}>
							Spread across DEXes
						</div>
						<div className={styles.swap_form_token_dex_info_toggle}>
							<div
								className={styles.swap_form_token_dex_info_toggle_action_text}
							>
								<LoadingText text={quote?.protocols.length}></LoadingText>{' '}
								Selected
							</div>
							{/* <DropDownIcon></DropDownIcon> */}
						</div>
					</div>

					{!web3.account ? (
						<button
							onClick={() => activateWeb3()}
							className={styles.swap_form_submit_button}
							type='button'
						>
							Connect Wallet
						</button>
					) : (
						<button
							onClick={() => {}}
							type='submit'
							className={styles.swap_form_submit_button}
						>
							Swap Tokens
						</button>
					)}
					<div className={styles.swap_form_meta_container}>
						<div>Max price slippage: 1%</div>
						<div>Gas price: {~~+gasPrice} GWEI</div>
					</div>
				</div>
				<SwapModal isVisible={searchState.isVisible}>
					<TokenSearch
						provider={provider}
						filter={searchState.filter}
						style={{ width: '100%', height: '100%', margin: 0 }}
						onClose={function (e) {
							setSearchState({
								isVisible: false,
								onSelect: () => {},
								filter: (t) => true,
							});
						}}
						onSelect={(t) => {
							searchState.onSelect(t);
						}}
					></TokenSearch>
				</SwapModal>
			</div>
		</form>
	);
};
