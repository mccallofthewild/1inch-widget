import {
	CSSProperties,
	LegacyRef,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { useAllTokens } from '../hooks/useAllTokens';
import { useDebounce } from '../hooks/useDebounce';
import React from 'react';
import styles from '../styles/tokensearch.module.css';
import { CheckCircle, ChevronDown, CreditCard, X } from '@geist-ui/react-icons';
import { useWalletTokens } from '../hooks/useWalletTokens';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { Loading, Spacer } from '@geist-ui/react';
import swapStyles from '../styles/swap.module.css';
import animStyles from '../styles/animations.module.css';
import sort from 'fast-sort';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Touchable } from './Touchable';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { TokenAvatar } from './TokenAvatar';

// Just load the top 100 tokens then dynamically search for the rest?

const defaultOnClose = () => {};
export const TokenSearch = ({
	onSelect = (t) => {},
	style = {},
	onClose = defaultOnClose,
	filter = () => true,
	provider,
	title,
	shouldHoldScrollPositionOnSelect,
	closeElement = (
		<div className={styles.token_search_close_button}>
			<X></X>
		</div>
	),
}: {
	onSelect?: (t: OneInchGraph.Token) => any | void;
	style?: CSSProperties;
	onClose?: Function;
	filter?: (t: OneInchGraph.Token) => boolean;
	provider: ethers.providers.Web3Provider;
	title?: string;
	shouldHoldScrollPositionOnSelect?: boolean;
	closeElement?: React.ReactNode;
}) => {
	const allTokens = useAllTokens();
	const walletTokens = useWalletTokens(provider);
	const walletTokenBalances = useTokenBalances(provider, walletTokens);
	const [query, setQuery, immediateQuery] = useDebounce('', 500);
	const [displayedTokens, setDisplayedTokens] = useState<OneInchGraph.Token[]>(
		[]
	);

	useEffect(() => {
		const walletTokenAddressMerge = walletTokens
			.map((t) => t.id)
			.join('-')
			.toLowerCase();
		const searchResults = allTokens.filter((t) =>
			(t.symbol + ' ' + t.name).toLowerCase().includes(query.toLowerCase())
		);
		const sorted = sort([...searchResults]).asc([
			(t) => +walletTokenBalances[t.id] * 100000,
			(t) => (walletTokenAddressMerge.includes(t.id.toLowerCase()) ? 100 : 0),
			(t) => t.symbol,
		]);
		setDisplayedTokens(sorted);
	}, [
		allTokens.length,
		query,
		Object.values(walletTokenBalances).length,
		walletTokens.length,
	]);

	const scrollEl = useRef<HTMLDivElement>();
	const tokenSearchResultHeight = 40;
	const infiniteScroll = useInfiniteScroll(
		displayedTokens,
		tokenSearchResultHeight,
		scrollEl.current
	);

	useEffect(() => {
		if (query != '') {
			setQuery('');
		}
	}, [filter]);
	return (
		<div
			style={{
				margin: 0,
				...style,
			}}
			className={styles.token_search_container}
		>
			<div className={styles.token_search__header}>
				<Spacer x={0.1}></Spacer>
				<div>
					<div
						className={[
							swapStyles.swap_header_item,
							swapStyles.swap_header_item_active,
						].join(' ')}
					>
						{title || 'SEARCH ' + allTokens.length + ' TOKENS'}
					</div>
					<Spacer y={0.4}></Spacer>
				</div>

				<Touchable
					style={{
						cursor: 'pointer',
						...(onClose == defaultOnClose
							? {
									opacity: 0,
									pointerEvents: 'none',
							  }
							: {}),
					}}
					onClick={() => {
						onClose();
						if (scrollEl.current && !shouldHoldScrollPositionOnSelect) {
							scrollEl.current.scrollTop = 0;
						}
					}}
				>
					{closeElement}
				</Touchable>
			</div>
			<div className={styles.token_search_bar_container}>
				{/* <div className={styles.token_search_bar_icon}>
					<TokenSearch.Icon></TokenSearch.Icon>
				</div> */}
				<input
					onInput={(e) => setQuery(e.currentTarget.value)}
					// autoFocus={true}
					placeholder={'e.g. ETH, Golem, DAI'}
					className={styles.token_search_bar_input}
				></input>
			</div>
			<div ref={scrollEl} className={styles.token_search_results_container}>
				<div style={{ height: infiniteScroll.padTop }}></div>
				{infiniteScroll.visibleItems.map((t, i) => (
					<div
						key={t.symbol}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							height: tokenSearchResultHeight,
							cursor: 'pointer',
						}}
						onClick={() => {
							onClose();
							onSelect(t);
							setQuery('');
							if (scrollEl.current && !shouldHoldScrollPositionOnSelect) {
								scrollEl.current.scrollTop = 0;
							}
						}}
						className={styles.token_search_results_item}
					>
						<div
							style={{
								width: '10%',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
							title={t.symbol}
						>
							<TokenAvatar token={t} size={15}></TokenAvatar>
						</div>
						<div
							style={{
								width: '50%',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
							title={t.symbol}
						>
							{t.symbol}
						</div>
						{/* <div
								style={{
									width: '33%',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
								title={t.name}
							>
								{t.name}
							</div> */}
						<div style={{ width: '33%' }}>
							{walletTokens.find((to) => to.id == t.id) ? (
								<small className={swapStyles.swap__input_descriptor_text}>
									{walletTokenBalances[t.id]?.slice(0, 10)}…
								</small>
							) : null}
							{/* <CreditCard></CreditCard> */}
						</div>
					</div>
				))}
				<div style={{ height: infiniteScroll.padBottom }}></div>
			</div>
			<div className={styles.token_search_results_container_overlay}></div>
		</div>
	);
};

const TokenSearchIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		height='24'
		viewBox='0 0 24 24'
		width='24'
	>
		<path d='M0 0h24v24H0z' fill='none' />
		<path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
	</svg>
);

const CloseIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		height='24'
		viewBox='0 0 24 24'
		width='24'
	>
		<path d='M0 0h24v24H0z' fill='none' />
		<path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
	</svg>
);
