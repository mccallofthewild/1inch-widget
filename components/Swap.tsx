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
import { Store } from '../store/Store';
import { StringDecoder } from 'string_decoder';
rateLimitContractsAndOneInch();
export const Swap = (props: {
	allTokens?: OneInchGraph.Token[];
	staticToTokenSymbol?: string;
}) => {
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

	const activateWeb3 = async () => {
		try {
			const connector = new InjectedConnector({
				supportedChainIds: [
					1, // Mainnet
				],
			});
			await web3.activate(connector, (e) => {
				alert(e.message);
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
			onSubmit={(e) => {
				e.preventDefault();
				console.log('submitting');
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
					>
						<ArrowDown size={22} color={'rgba(0, 0, 0, 0.25)'}></ArrowDown>
					</div>
					{/* <OneInchLogo></OneInchLogo> */}
					<div className={styles.swap_form_token_divider}></div>
					<div
						onClick={async () => {
							if (!(toToken && fromToken) || isAnimatingTokenSwitch) return;
							const fromTokenEl = document.getElementById(
								'token--' + fromToken.symbol
							);
							const toTokenEl = document.getElementById(
								'token--' + toToken.symbol
							);
							setOutput('');
							isAnimatingTokenSwitch = true;
							await Promise.all([
								replaceTransition(fromTokenEl, toTokenEl),
								replaceTransition(toTokenEl, fromTokenEl),
							]);
							isAnimatingTokenSwitch = false;
							setFromToken(toToken);
							setToToken(fromToken);
							if (quote) {
								try {
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
								console.log(t);
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
						<div className={styles.swap_form_token_dex_info_toggle_action_text}>
							<LoadingText text={quote?.protocols.length}></LoadingText>{' '}
							Selected
						</div>
						{/* <DropDownIcon></DropDownIcon> */}
					</div>
				</div>

				<button
					onClick={() => {
						if (!web3.account) activateWeb3();
					}}
					type='submit'
					className={styles.swap_form_submit_button}
				>
					{web3.account ? 'Swap Tokens' : 'Connect Wallet'}
				</button>
				<div className={styles.swap_form_meta_container}>
					<div>Max price slippage: 1%</div>
					<div>Gas price: {gasPrice} GWEI</div>
				</div>
			</div>
			{searchState.isVisible ? (
				<TokenSearch
					provider={provider}
					filter={searchState.filter}
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
					style={{
						position: 'absolute',
						margin: 0,
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
					}}
				></TokenSearch>
			) : null}
		</form>
	);
};

const OneInchLogo = () => (
	<svg
		id='logo'
		viewBox='0 0 150 56'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path d='M60 13H66V37H72V7H66C62.7 7 60 9.7 60 13Z' fill='currentColor' />
		<path d='M78 37H84V25C84 21.7 81.3 19 78 19V37Z' fill='currentColor' />
		<path
			d='M90 19V37H96V25H102V31C102 34.3 104.7 37 108 37V25C108 21.7 105.3 19 102 19H90Z'
			fill='currentColor'
		/>
		<path
			d='M144 19H138V13C138 9.7 135.3 7 132 7V31H120V25H126V19H120C116.7 19 114 21.7 114 25V31C114 34.3 116.7 37 120 37H138V25H144V31C144 34.3 146.7 37 150 37V25C150 21.7 147.3 19 144 19Z'
			fill='currentColor'
		/>
		<path d='M78 13H84C84 9.7 81.3 7 78 7V13Z' fill='currentColor' />
		<path
			d='M68.4865 47.136H66V43.064H68.4266V43.733H66.737V44.7452H68.2469V45.4141H66.737V46.467H68.4865V47.136Z'
			fill='#2F7AEA'
		/>
		<path
			d='M79.3865 43.064H80.2493L78.8353 45.0593L80.3033 47.136H79.4405L78.356 45.6061L77.2775 47.136H76.4147L77.8826 45.0593L76.4806 43.064H77.3434L78.3739 44.5357L79.3865 43.064Z'
			fill='#2F7AEA'
		/>
		<path
			d='M91.1232 46.2053L91.4048 46.7404C91.273 46.8762 91.0833 46.9867 90.8356 47.072C90.5919 47.1573 90.3343 47.2 90.0627 47.2C89.4236 47.2 88.9023 47.008 88.4989 46.6241C88.0994 46.2402 87.8997 45.7321 87.8997 45.1C87.8997 44.495 88.0894 43.9928 88.4689 43.5934C88.8444 43.1978 89.3696 43 90.0447 43C90.58 43 91.0054 43.1377 91.3209 43.413L90.9914 43.9424C90.7078 43.7601 90.3922 43.669 90.0447 43.669C89.6453 43.669 89.3177 43.7989 89.0621 44.0587C88.8064 44.3186 88.6786 44.6657 88.6786 45.1C88.6786 45.5266 88.8124 45.8717 89.0801 46.1355C89.3517 46.3992 89.7012 46.531 90.1286 46.531C90.4961 46.531 90.8276 46.4224 91.1232 46.2053Z'
			fill='#2F7AEA'
		/>
		<path
			d='M103.012 47.136H102.281V45.3967H100.364V47.136H99.627V43.064H100.364V44.7277H102.281V43.064H103.012V47.136Z'
			fill='#2F7AEA'
		/>
		<path
			d='M111.867 47.136H111.124L112.897 43.0524H113.544L115.318 47.136H114.533L114.096 46.0947H112.304L111.867 47.136ZM113.814 45.4258L113.203 43.9773L112.586 45.4258H113.814Z'
			fill='#2F7AEA'
		/>
		<path
			d='M127.019 43.064V47.136H126.431L124.125 44.3147V47.136H123.436V43.064H124.023L126.33 45.897V43.064H127.019Z'
			fill='#2F7AEA'
		/>
		<path
			d='M138.427 45.6119H137.414V44.9429H139.116V46.6299C138.936 46.8044 138.696 46.944 138.397 47.0488C138.097 47.1496 137.814 47.2 137.546 47.2C136.867 47.2 136.332 47.01 135.94 46.6299C135.553 46.2537 135.359 45.7438 135.359 45.1C135.359 44.5028 135.551 44.0044 135.934 43.605C136.318 43.2017 136.823 43 137.45 43C137.985 43 138.435 43.1377 138.798 43.413L138.487 43.9831C138.383 43.8861 138.245 43.8105 138.073 43.7562C137.901 43.6981 137.724 43.669 137.54 43.669C137.121 43.669 136.783 43.797 136.527 44.0529C136.268 44.305 136.138 44.654 136.138 45.1C136.138 45.5305 136.268 45.8776 136.527 46.1413C136.783 46.4011 137.127 46.531 137.558 46.531C137.71 46.531 137.874 46.5039 138.049 46.4496C138.225 46.3914 138.351 46.3255 138.427 46.2518V45.6119Z'
			fill='#2F7AEA'
		/>
		<path
			d='M150 47.136H147.513V43.064H149.94V43.733H148.25V44.7452H149.76V45.4141H148.25V46.467H150V47.136Z'
			fill='#2F7AEA'
		/>
		<path
			d='M13.9265 30.5529L15.3265 20.0092L3.164 11.5654L14.2765 15.3279L16.9015 11.3029L26.4828 5.35291L47.614 16.9904L48.7078 34.7529L39.3015 47.8342L31.864 48.9717L35.714 41.9279V35.1467L32.914 29.8529L30.0703 27.9717L25.6953 32.4779V37.2467L22.2828 40.4404L17.9515 40.9654L16.0265 42.0592L12.8765 41.0529L11.564 36.3279L13.9265 33.0029V30.5529Z'
			fill='white'
		/>
		<path
			d='M33.3514 11.4779C31.0327 10.9967 28.4952 11.1279 28.4952 11.1279C28.4952 11.1279 27.6639 14.9779 22.5014 15.9842C22.5452 15.9842 29.3264 18.3029 33.3514 11.4779Z'
			fill='#94A6C3'
		/>
		<path
			d='M35.4514 46.3905C38.2514 44.203 40.3514 41.1842 41.3139 37.7717C41.3576 37.6405 41.7514 37.4217 42.0139 37.2467C42.4514 36.9842 42.8889 36.7655 42.9764 36.4155C43.1514 35.4092 43.2389 34.3592 43.2389 33.3092C43.2389 32.9155 42.8451 32.5217 42.4514 32.128C42.1451 31.8655 41.8389 31.5592 41.8389 31.3405C41.4014 27.3592 39.5639 23.6405 36.6326 20.928L36.3264 21.2342C39.1701 23.903 41.0076 27.5342 41.4014 31.3842C41.4451 31.7342 41.7951 32.0842 42.1451 32.4342C42.4514 32.6967 42.8014 33.0905 42.8014 33.2655C42.8014 34.2717 42.7139 35.278 42.5389 36.2842C42.4951 36.4592 42.1014 36.6342 41.7951 36.8092C41.3576 37.028 40.9639 37.2467 40.8764 37.5967C39.8264 41.3155 37.4201 44.553 34.2264 46.653C34.7951 45.428 36.5889 41.4467 37.5514 39.4342L37.3764 32.9592L31.8201 27.578L28.6701 28.0155L25.2139 33.6155C25.2139 33.6155 26.8326 35.6717 24.5576 38.078C22.3264 40.4405 20.5764 40.9655 20.5764 40.9655L18.9576 40.0905C19.4389 39.478 20.4014 38.5592 21.1451 37.9467C22.4139 36.8967 23.6826 36.8092 23.6826 35.6717C23.7264 33.3092 21.1889 33.9655 21.1889 33.9655L20.2701 34.8405L19.8764 38.078L17.9514 40.4842L17.7326 40.4405L14.5826 39.7405C14.5826 39.7405 16.5076 38.7342 16.8139 37.5967C17.1201 36.503 16.2014 32.8717 16.1576 32.653C16.2014 32.6967 17.0764 33.4405 17.4701 34.6655C18.1701 32.7405 19.0889 30.903 19.3514 30.728C19.6139 30.553 23.1576 28.6717 23.1576 28.6717L21.9764 31.778L22.8514 31.2967L24.9514 26.1342C24.9514 26.1342 27.0076 25.128 28.5389 25.128C31.2951 25.0842 35.3639 21.7155 33.5264 15.678C34.0514 15.8967 43.1514 20.4467 44.7264 29.3717C45.9076 36.2405 42.0139 42.6717 35.4514 46.3905Z'
			fill='#94A6C3'
		/>
		<path
			d='M25.039 12.4404C26.0452 11.2591 25.6515 9.50911 25.6515 9.50911L22.7202 13.8404C22.6765 13.8404 23.7702 13.8841 25.039 12.4404Z'
			fill='#1B314F'
		/>
		<path
			d='M15.1952 36.1092L15.5452 34.3592C15.5452 34.3592 14.1014 36.8967 13.9702 37.2467C13.8389 37.6405 14.0577 38.3405 14.6264 38.2967C15.1952 38.253 15.8952 37.4217 15.8952 36.8092C15.8952 36.0217 15.1952 36.1092 15.1952 36.1092Z'
			fill='#1B314F'
		/>
		<path
			d='M41.1827 8.28416C41.1827 8.28416 43.3702 8.37166 45.6452 8.63416C40.5264 4.60916 35.6702 3.42791 31.7327 3.42791C26.3077 3.42791 22.6327 5.65916 22.4139 5.79041L24.1202 3.07791C24.1202 3.07791 17.2952 2.42166 14.8889 9.64041C14.2764 8.10916 13.7077 5.87791 13.7077 5.87791C13.7077 5.87791 10.1639 8.98416 11.8264 14.1467C7.75769 12.6592 1.93894 10.6029 1.72019 10.5592C1.41394 10.5154 1.32644 10.6467 1.32644 10.6467C1.32644 10.6467 1.23894 10.7779 1.50144 10.9967C1.98269 11.3904 11.1702 18.1717 13.1827 19.4842C12.7452 21.0592 12.7452 21.8029 13.1827 22.5467C13.7952 23.5529 13.8389 24.0779 13.7514 24.8217C13.6639 25.5654 12.8764 31.9967 12.7014 32.7842C12.5264 33.5717 10.6889 36.3717 10.7764 37.2029C10.8639 38.0342 12.0014 41.5779 13.0077 41.9717C13.7514 42.2342 15.5889 42.8029 16.8139 42.8029C17.2514 42.8029 17.6452 42.7154 17.8202 42.5404C18.5639 41.8842 18.7827 41.7529 19.3077 41.7529C19.3514 41.7529 19.3952 41.7529 19.4389 41.7529C19.6577 41.7529 19.9202 41.7967 20.2264 41.7967C20.9264 41.7967 21.8452 41.6654 22.5014 41.0529C23.4639 40.0904 25.1264 38.7779 25.6514 38.1654C26.3077 37.3342 26.6577 36.1967 26.4827 35.0592C26.3514 34.0092 26.9202 33.0904 27.5764 32.1717C28.4077 31.0779 29.9389 29.1092 29.9389 29.1092C32.9577 31.3842 34.8389 34.8404 34.8389 38.6904C34.8389 45.5154 28.8889 51.0279 21.5389 51.0279C20.4014 51.0279 19.3077 50.8967 18.2139 50.6342C21.5827 51.8154 24.4264 52.2092 26.7452 52.2092C31.6889 52.2092 34.3139 50.4154 34.3139 50.4154C34.3139 50.4154 33.3952 51.5967 31.9077 52.9529C31.9514 52.9529 31.9514 52.9529 31.9514 52.9529C40.1327 51.8154 44.1139 45.0779 44.1139 45.0779C44.1139 45.0779 43.8077 47.2654 43.4139 48.7529C54.3077 40.5717 52.4702 30.3342 52.4264 29.9842C52.5139 30.1154 53.6077 31.4279 54.1764 32.1279C55.9264 14.1029 41.1827 8.28416 41.1827 8.28416ZM24.4264 37.0717C24.2514 37.2904 23.5077 37.9467 22.9827 38.4279C22.4577 38.9092 21.8889 39.3904 21.4514 39.8279C21.2764 40.0029 20.9264 40.0904 20.4014 40.0904C20.2264 40.0904 20.0514 40.0904 19.9202 40.0904C19.8327 40.0904 19.7452 40.0904 19.6577 40.0904C19.5702 40.0904 19.5264 40.0904 19.4827 40.0904C19.3514 40.0904 19.2202 40.0904 19.0889 40.0904C19.7452 39.2154 21.6702 37.2029 22.3264 36.7654C23.1139 36.2404 23.5077 35.7154 23.0264 34.7967C22.5452 33.8779 21.2764 34.0967 21.2764 34.0967C21.2764 34.0967 22.0202 33.7904 22.6764 33.7904C21.8452 33.5717 20.7952 33.7904 20.3139 34.2717C19.7889 34.7529 19.8764 36.4592 19.6577 37.5529C19.4389 38.6904 18.6952 39.2592 17.5577 40.3092C16.9452 40.8779 16.5077 41.0529 16.1577 41.0529C15.4139 40.9217 14.5389 40.7029 13.9264 40.4842C13.4889 39.9154 12.8327 38.0342 12.6577 37.2467C12.7889 36.8092 13.3139 35.8904 13.5764 35.3654C14.1014 34.3592 14.4077 33.7904 14.4952 33.2654C14.6702 32.5217 15.2389 27.9279 15.4577 26.0029C16.0264 26.7467 16.8139 27.9717 16.6389 28.7592C17.9077 26.9654 16.9889 25.2154 16.5514 24.5154C16.1577 23.8154 15.6327 22.4154 16.0702 20.9279C16.5077 19.4404 18.0827 15.3279 18.0827 15.3279C18.0827 15.3279 18.6077 16.2467 19.3514 16.0717C20.0952 15.8967 26.0889 6.88416 26.0889 6.88416C26.0889 6.88416 27.7077 10.4279 26.0014 13.0092C24.2514 15.5904 22.5452 16.0717 22.5452 16.0717C22.5452 16.0717 24.9514 16.5092 27.1827 14.8904C28.1014 17.0342 28.9764 19.2654 29.0202 19.5717C28.8889 19.8779 27.1389 24.0779 26.9639 24.3404C26.8764 24.4279 26.2639 24.6029 25.8264 24.6904C25.0827 24.9092 24.6452 25.0404 24.4702 25.1717C24.1639 25.4342 22.7639 29.2842 22.1077 31.1654C21.3202 31.3842 20.5327 31.8217 19.9639 32.6967C20.2702 32.4779 21.2327 32.3467 21.9327 32.2592C22.5452 32.2154 24.4264 33.2217 24.9077 35.1029C24.9077 35.1467 24.9077 35.1467 24.9077 35.1904C24.9952 35.8904 24.7764 36.5467 24.4264 37.0717ZM20.3139 37.5967C20.7077 37.0279 20.6639 36.0654 20.7077 35.7592C20.7514 35.4529 20.8389 34.8842 21.1889 34.7967C21.5389 34.7092 22.3702 34.8404 22.3702 35.4529C22.3702 36.0217 21.7577 36.1529 21.3202 36.5467C21.0139 36.8529 20.4014 37.5092 20.3139 37.5967ZM37.7702 29.2404C38.2077 27.0092 38.2514 25.0842 38.1202 23.5092C39.8264 25.7842 40.8764 28.5404 41.1827 31.3842C41.2264 31.7342 41.5764 32.0842 41.9264 32.4342C42.2327 32.6967 42.5827 33.0467 42.5827 33.2654C42.5827 34.2717 42.4952 35.2779 42.3202 36.2842C42.2764 36.4154 41.8827 36.6342 41.5764 36.8092C41.1389 37.0279 40.7452 37.2467 40.6577 37.5967C39.6952 40.9654 37.6389 43.9404 34.8827 46.0404C38.9514 41.7967 40.9202 34.7967 37.7702 29.2404ZM35.0139 46.4342C37.8577 44.2467 40.0452 41.1842 41.0077 37.7279C41.0514 37.5967 41.4452 37.3779 41.7077 37.2029C42.1452 36.9842 42.5827 36.7217 42.6702 36.3717C42.8452 35.3654 42.9327 34.3154 42.9327 33.2654C42.9327 32.8717 42.5389 32.4779 42.1452 32.0842C41.9264 31.8217 41.5764 31.5154 41.5764 31.2967C41.2264 28.1029 39.9577 25.0842 37.9889 22.5904C37.1139 17.3404 33.6139 15.7217 33.5264 15.6779C33.6139 15.8092 35.8889 19.0904 34.3139 22.9404C32.6952 26.8342 28.5389 26.2217 28.1889 26.2654C27.8389 26.2654 26.4827 28.0154 24.7764 31.2529C24.5577 31.1654 23.6389 30.9467 22.5889 31.1217C23.3764 28.9342 24.5577 25.8279 24.7764 25.5654C24.8639 25.4779 25.5202 25.3029 25.9577 25.1717C26.7889 24.9529 27.1827 24.8217 27.3139 24.6467C27.4014 24.5154 27.8389 23.5092 28.2764 22.4592C28.6702 22.4592 29.6764 22.3717 29.7639 22.3279C29.8514 22.2404 30.6827 20.0967 30.6827 19.8342C30.6827 19.6154 28.9764 15.3717 28.3202 13.7529C28.6264 13.4029 28.9327 12.9654 29.2389 12.4842C38.2077 13.4467 45.2077 21.0592 45.2077 30.2904C45.2077 37.3779 41.0514 43.5467 35.0139 46.4342Z'
			fill='#1B314F'
		/>
		<path
			d='M23.3764 22.8091C24.2077 21.8466 23.7702 20.0529 22.2389 19.7466C22.6327 18.8279 23.2014 16.9904 23.2014 16.9904C23.2014 16.9904 18.7389 23.9904 18.3452 24.1216C17.9514 24.2529 17.5577 22.7216 17.5577 22.7216C16.7264 25.9154 18.9577 26.3529 19.2202 25.3466C20.4452 25.0404 22.5452 23.7279 23.3764 22.8091Z'
			fill='#1B314F'
		/>
		<path
			d='M19.5703 24.5156L21.8453 20.6218C21.8453 20.6218 23.1578 21.2781 22.5015 22.3281C21.6703 23.5531 19.5703 24.5156 19.5703 24.5156Z'
			fill='#FFD923'
		/>
		<path
			d='M47.7013 42.5406C47.045 43.4156 46.3013 44.3343 45.4263 45.2093C51.07 34.3593 45.6888 24.4281 45.47 24.0343C45.8638 24.4281 46.2575 24.8656 46.6075 25.2593C50.9388 30.0718 51.4638 37.2906 47.7013 42.5406Z'
			fill='#D82122'
		/>
		<path
			d='M52.9513 28.5843C50.9825 23.2906 48.1825 18.7843 42.0138 14.7156C36.0638 10.7781 29.6763 11.0843 29.3263 11.1281C29.2825 11.1281 29.2388 11.1281 29.2388 11.1281C29.4575 11.0406 29.6763 10.9968 29.895 10.9531C31.2513 10.5156 33.0013 10.1656 34.7513 9.94683C39.3888 9.29058 44.07 10.8656 47.2638 14.2343C47.3075 14.2781 47.3075 14.2781 47.3513 14.3218C50.9825 18.1718 52.8638 22.9843 52.9513 28.5843Z'
			fill='#D82122'
		/>
		<path
			d='M40.6138 6.92819C34.095 5.70319 29.895 6.31569 26.8763 7.45319C26.7888 7.10319 26.4825 6.40319 26.22 5.83444C25.3013 6.92819 24.3388 8.24069 23.7263 9.07194C22.0638 10.2094 21.3638 11.3032 21.3638 11.3032C22.3263 8.02194 25.1263 5.57194 28.5388 4.95944C29.5013 4.78444 30.5513 4.69694 31.6888 4.69694C34.7075 4.74069 37.7263 5.48444 40.6138 6.92819Z'
			fill='#D82122'
		/>
		<path
			d='M16.5075 15.3282C11.3888 15.1532 13.095 9.20319 13.1825 8.85319C13.1825 8.89694 13.5325 13.5344 16.5075 15.3282Z'
			fill='#D82122'
		/>
		<path
			d='M21.5388 4.60938C17.6013 6.97187 18.3888 12.6156 18.3888 12.6156C14.6263 6.88437 21.2325 4.74063 21.5388 4.60938Z'
			fill='#D82122'
		/>
		<path
			d='M15.0639 16.9029C15.3264 17.1217 15.5889 17.5154 15.2827 18.0842C15.1077 18.3904 14.8452 18.3467 14.4514 18.1717C13.9264 17.9092 10.7764 16.0717 7.93268 14.1904C11.1702 15.3279 14.4514 16.5529 14.9764 16.8154C14.9764 16.8154 15.0202 16.8592 15.0639 16.9029Z'
			fill='white'
		/>
	</svg>
);
