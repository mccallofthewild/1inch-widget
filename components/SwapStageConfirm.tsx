import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { calc } from '../helpers/calc';
import { useAllTokens } from '../hooks/useAllTokens';
import { useCoinPriceUSD } from '../hooks/useCoinPriceUSD';
import { CoinPriceUSD } from './CoinPriceUSD';
import { LoadingText } from './LoadingText';
import styles from '../styles/swap.module.css';
import utilStyles from '../styles/utils.module.css';
import { OneInchGraph } from '../generated/OneInchGraph';
export const SwapStageConfirm = (props: {
	swap: OneInchApi.Swap;
	fromToken: OneInchGraph.Token;
	confirm: Function;
	deny: Function;
}) => {
	const allTokens = useAllTokens();
	const { swap, fromToken } = props;
	const swapStats = useMemo(() => {
		if (!swap) return {};
		const fromTokenQuantity = formatUnits(
			BigNumber.from(swap.fromTokenAmount),
			BigNumber.from(swap.fromToken.decimals)
		);
		const toTokenQuantity = formatUnits(
			BigNumber.from(swap.toTokenAmount),
			BigNumber.from(swap.toToken.decimals)
		);
		const rate = calc`${fromTokenQuantity} / ${toTokenQuantity}`;
		const feeRaw = calc`${swap.tx.gas} * ${swap.tx.gasPrice}`;

		return {
			toTokenQuantity,
			fromTokenQuantity,
			rate,
			gasPrice: formatUnits(BigNumber.from(swap.tx.gasPrice), 'gwei'),
			fee: formatUnits(BigNumber.from(feeRaw), 'ether'),
		};
	}, [swap]);

	const ethToken = useMemo(() => allTokens.find((t) => t.symbol == 'ETH'), [
		allTokens,
	]);

	const costInUSD = useCoinPriceUSD({
		token: fromToken,
		tokenQuantity: swapStats.fromTokenQuantity,
	});

	const txFeeInUSD = useCoinPriceUSD({
		token: ethToken,
		tokenQuantity: swapStats.fee,
	});

	const totalInUSD = useMemo(
		() => (txFeeInUSD && costInUSD ? calc`${txFeeInUSD} + ${costInUSD}` : ''),
		[txFeeInUSD, costInUSD]
	);
	return (
		<div className={styles.swap_container}>
			<div className={styles.swap_header}>
				<div
					className={[
						styles.swap_header_item,
						styles.swap_header_item_active,
					].join(' ')}
				>
					CONFIRM SWAP
				</div>
			</div>
			<div className={styles.swap_form_container}>
				{/* <u>
					<code>Order:</code>
				</u> */}
				{/* <br /> */}
				<small>
					<code>
						{'  '}
						<b>Product:</b> {swap?.toToken.symbol}
					</code>
					<br />
					<code>
						<span title={swapStats.toTokenQuantity}>
							<b>Quantity:</b> {(+swapStats.toTokenQuantity).toFixed(8)}…
						</span>
					</code>
					<br />
					<code>
						<span title={swapStats.rate}>
							× <b>Rate:</b> {(+swapStats.rate).toFixed(8)}…
						</span>{' '}
						{swap?.fromToken.symbol}/{swap?.toToken.symbol}
					</code>
					<br />
					<code>
						+ <b>Gas Price:</b>{' '}
						<LoadingText text={swapStats.gasPrice}></LoadingText> GWEI
					</code>
					<br />
					<code>
						× <b>Gas:</b>{' '}
						<LoadingText text={swap?.tx.gas.toString()}></LoadingText>
					</code>
					<br />
					<hr />
					<code>
						<b> COST:</b> {swapStats.fromTokenQuantity} {swap?.fromToken.symbol}{' '}
						(
						<CoinPriceUSD
							prefix='≈'
							token={fromToken}
							tokenQuantity={swapStats.fromTokenQuantity}
						></CoinPriceUSD>
						)
					</code>
					<br />
					<code>
						<b>{'+'} FEE:</b> <LoadingText text={swapStats.fee}></LoadingText>{' '}
						ETH (
						<CoinPriceUSD
							prefix='≈'
							token={ethToken}
							tokenQuantity={swapStats.fee}
						></CoinPriceUSD>
						)
					</code>
					<br />
					<hr />
					<code>
						<b>TOTAL:</b> ≈$<LoadingText text={totalInUSD}></LoadingText>
					</code>
				</small>
				<div className={utilStyles.button_group}>
					<button onClick={() => props.confirm()} className={utilStyles.button}>
						Confirm
					</button>
					<button
						onClick={() => props.deny()}
						className={[utilStyles.button, utilStyles.button_outline].join(' ')}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
