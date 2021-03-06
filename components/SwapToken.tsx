import { Button, Loading, Spacer, Spinner, Tooltip } from '@geist-ui/react';
import { BigNumber } from 'ethers';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { getGradients } from '../helpers/getGradients';
import styles from '../styles/swap.module.css';
import { CoinPriceUSD } from './CoinPriceUSD';
import { useDebounce } from '../hooks/useDebounce';
import { safeParseUnits } from '../helpers/safeParseUnits';
import { Check } from '@geist-ui/react-icons';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { Store } from '../contexts/Store';
import { LoadingText } from './LoadingText';
import { Touchable } from './Touchable';
import anime from 'animejs';
import { TokenAvatar } from './TokenAvatar';
import { useGasPrice } from '../hooks/useGasPrice';
import { useWeb3React } from '@web3-react/core';
import { calc } from '../helpers/calc';

export const SwapToken = (props: {
	token: OneInchGraph.Token;
	quantity: string;
	setQuantity?: Function;
	readonly?: boolean;
	onClickToChangeToken: Function;
	loading?: boolean;
	walletBalance?: string;
	hasBalance: boolean;
	isStatic?: boolean;
}) => {
	const web3 = useWeb3React();
	const [localQuantity, setLocalQuantity, immediateLocalQuantity] = useDebounce<
		string | number
	>(props.quantity, 450);

	const gasPrice = useGasPrice();
	const { maxSpend, isEqualToMaxSpend, isGreaterThanMaxSpend } = useMemo<{
		maxSpend: string;
		isEqualToMaxSpend: boolean;
		isGreaterThanMaxSpend: boolean;
	}>(() => {
		if (
			!props.token ||
			!props.walletBalance ||
			(props.token?.symbol == 'ETH' && !gasPrice) ||
			!props.hasBalance ||
			!props.walletBalance
		) {
			return {
				maxSpend: '0',
				isEqualToMaxSpend: false,
				isGreaterThanMaxSpend: false,
			};
		}
		const parsedQuantity = safeParseUnits(
			(immediateLocalQuantity || '0') + '',
			props.token
		);
		const parsedBalance = safeParseUnits(
			props.walletBalance || '0',
			props.token
		);
		let maxSpendParsed = BigNumber.from(parsedBalance);
		if (props.token?.symbol == 'ETH') {
			const approxGasUsage = 310400;
			const etherTxFee = parseUnits(gasPrice, 'gwei').mul(
				BigNumber.from(approxGasUsage)
			);
			maxSpendParsed = parsedBalance.sub(etherTxFee);
			if (maxSpendParsed.lte(BigNumber.from(0))) {
				maxSpendParsed = BigNumber.from(0);
			}
		}
		const maxSpendFormatted = formatUnits(
			BigNumber.from(maxSpendParsed),
			BigNumber.from(props.token.decimals)
		);
		return {
			isEqualToMaxSpend: parsedQuantity.eq(maxSpendParsed),
			isGreaterThanMaxSpend: parsedQuantity.gt(maxSpendParsed),
			maxSpend: maxSpendFormatted,
		};
	}, [
		gasPrice,
		props.token?.symbol,
		props.walletBalance,
		immediateLocalQuantity,
	]);

	useEffect(() => {
		if (props.setQuantity) props.setQuantity(localQuantity);
	}, [localQuantity]);
	useEffect(() => {
		if (props.quantity != localQuantity) setLocalQuantity(props.quantity);
	}, [props.quantity]);

	const inputRef = useRef<HTMLInputElement>();

	const [activeAnimations, setActiveAnimations] = useState({
		loading: false,
		updating: false,
	});

	useEffect(() => {
		const disableAnimation = true;
		if (disableAnimation) return;
		if (!inputRef.current || inputRef.current == document.activeElement) return;
		if (!inputRef.current.value || inputRef.current.value == props.quantity)
			return;
		setActiveAnimations({
			...activeAnimations,
			updating: true,
		});
		anime({
			targets: inputRef.current,
			value: [+inputRef.current.value, +(immediateLocalQuantity + '').trim()],
			duration: 450,
			easing: 'linear',
			elasticity: 0,
			autoplay: true,
		}).finished.then(() => {
			setActiveAnimations({
				...activeAnimations,
				updating: false,
			});
		});
	}, [props.quantity, immediateLocalQuantity]);
	return (
		<div
			id={'token--' + props.token?.symbol}
			className={styles.swap_form_token_container}
		>
			<div className={styles.swap_form_token_label}>
				{props.token ? props.token.symbol : <Loading></Loading>}
			</div>
			<div className={styles.swap_form_token_select_container}>
				<div className={styles.swap_form_token_select}>
					<Touchable
						style={{ cursor: 'pointer' }}
						onClick={() => {
							if (props.isStatic) return;
							props.onClickToChangeToken();
						}}
						className={styles.swap_form_token_select_icon}
					>
						<TokenAvatar size={34} token={props.token}></TokenAvatar>
						<div
							style={{
								opacity: props.isStatic ? 0 : 1,
							}}
							className={styles.swap_form_token_select_icon_chevron_down}
						>
							<DropDownIcon></DropDownIcon>
						</div>
					</Touchable>
				</div>
				<div className={styles.swap_form_token_amount_input_container}>
					<input
						ref={inputRef}
						value={immediateLocalQuantity || ''}
						required={!props.readonly}
						autoFocus={!props.readonly}
						min='0'
						max={maxSpend || Infinity}
						readOnly={props.readonly}
						step={'any'}
						onChange={(e) => {
							// if (Object.values(activeAnimations).some((v) => v)) return;
							let val = e.currentTarget.value;
							let isValid = false;
							try {
								let expectedFormat = formatUnits(
									safeParseUnits(val, props.token),
									props.token?.decimals
								);

								if (+expectedFormat != +val) {
									e.currentTarget.value = expectedFormat;
									val = expectedFormat;
								}
							} catch (e) {}

							if (val != undefined) {
								setLocalQuantity(val || 0);
							}
						}}
						type='number'
						placeholder={props.loading ? 'loading...' : '1.32009'}
						className={styles.swap_form_token_amount_input}
					></input>

					<div
						style={{
							opacity: props.readonly || !web3.account ? 0 : 1,
							pointerEvents: props.readonly ? 'none' : 'all',
							marginBottom: '-1em',
							textAlign: 'center',
							...(!props.hasBalance ||
							(props.hasBalance && props.walletBalance && isGreaterThanMaxSpend)
								? { color: '#ff4567' }
								: {}),
						}}
						className={styles.swap__input_descriptor_text}
					>
						{props.hasBalance ? (
							<>
								/{' '}
								<LoadingText
									loading={props.walletBalance == undefined && props.hasBalance}
									text={
										<span>
											{maxSpend?.slice(0, 10)}… (
											{isEqualToMaxSpend ? (
												<span
													style={{
														transform: 'translateY(4px)',
														display: 'inline-block',
														height: 13,
														overflow: 'hidden',
													}}
												>
													<Check size={13}></Check>
												</span>
											) : (
												<u
													onClick={() => setLocalQuantity(maxSpend)}
													style={{ cursor: 'pointer', height: 15 }}
												>
													MAX
												</u>
											)}
											)
										</span>
									}
								></LoadingText>
							</>
						) : (
							'/ zero funds'
						)}
					</div>
				</div>
				<div className={styles.swap_form_token_amount_in_fiat_container}>
					<div className={styles.swap_form_token_amount_in_fiat}>
						<div>
							<CoinPriceUSD
								token={props.token}
								isReady={props.quantity == immediateLocalQuantity}
								prefix='≈'
								// tokenDecimals={props.token?.decimals.toString()}
								// tokenAddress={props.token?.id}
								tokenQuantity={props.quantity}
							></CoinPriceUSD>
						</div>
						{/* {props.walletBalance ? (
							<div title={props.walletBalance}>
								bal = {props.walletBalance?.slice(0, 5)}…
							</div>
						) : null} */}
					</div>
				</div>
			</div>
		</div>
	);
};

const DropDownIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		height='24'
		viewBox='0 0 24 24'
		width='24'
	>
		<path d='M0 0h24v24H0z' fill='none' />
		<path d='M7 10l5 5 5-5z' />
	</svg>
);
