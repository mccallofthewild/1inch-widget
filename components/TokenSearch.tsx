import { CSSProperties, LegacyRef, useEffect, useState } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { OneInchGraph } from '../generated/OneInchGraph';
import { useAllTokens } from '../hooks/useAllTokens';
import { useDebounce } from '../hooks/useDebounce';
import React from 'react';
import styles from '../styles/tokensearch.module.css';
import { CheckCircle } from '@geist-ui/react-icons';
import { useWalletTokens } from '../hooks/useWalletTokens';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useTokenBalances } from '../hooks/useTokenBalances';
// Just load the top 100 tokens then dynamically search for the rest?
export const TokenSearch = React.forwardRef(
	(
		{
			onSelect = (t) => {},
			style,
			onClose = () => {},
			filter = () => true,
			provider,
		}: {
			onSelect?: (t: OneInchGraph.Token) => any | void;
			style: CSSProperties;
			onClose?: Function;
			filter?: (t: OneInchGraph.Token) => boolean;
			provider: ethers.providers.Web3Provider;
		},
		ref
	) => {
		const allTokens = useAllTokens();
		const walletTokens = useWalletTokens(provider);
		const walletTokenBalances = useTokenBalances(provider, walletTokens);
		const [query, setQuery, immediateQuery] = useDebounce('', 500);
		const [displayedTokens, setDisplayedTokens] = useState<
			OneInchGraph.Token[]
		>([]);

		useEffect(() => {
			setDisplayedTokens(
				allTokens
					.filter(
						(t) =>
							(t.symbol + ' ' + t.name)
								.toLowerCase()
								.includes(query.toLowerCase()) && filter(t)
					)
					.sort((tA, tB) => {
						if (walletTokenBalances[tA.id] < walletTokenBalances[tB.id]) {
							return -1;
						}
						if (walletTokenBalances[tA.id] == walletTokenBalances[tB.id]) {
							return 0;
						}
						return 1;
					})
			);
		}, [allTokens, query, filter, walletTokenBalances, walletTokens]);
		useEffect(() => {
			setQuery('');
		}, [filter]);
		return (
			<div ref={ref} style={style} className={styles.token_search_container}>
				<div
					onClick={() => onClose()}
					className={styles.token_search_close_button}
				>
					<CloseIcon></CloseIcon>
				</div>
				<div className={styles.token_search_bar_container}>
					{/* <div className={styles.token_search_bar_icon}>
					<TokenSearch.Icon></TokenSearch.Icon>
				</div> */}
					<input
						onInput={(e) => setQuery(e.currentTarget.value)}
						autoFocus={true}
						placeholder={'Search ' + allTokens.length + ' Tokens'}
						className={styles.token_search_bar_input}
					></input>
				</div>
				<div className={styles.token_search_results_container}>
					{displayedTokens.map((t) => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
							onClick={() => {
								onSelect(t);
								onClose();
							}}
							key={t.symbol}
							className={styles.token_search_results_item}
						>
							<div
								style={{
									width: '80%',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
								title={t.name}
							>
								<b>{t.symbol}</b> - {t.name}
							</div>
							{walletTokenBalances[t.id] ? <CheckCircle></CheckCircle> : null}
						</div>
					))}
					<div style={{ height: '100px' }}></div>
				</div>
				<div className={styles.token_search_results_container_overlay}></div>
			</div>
		);
	}
);

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
