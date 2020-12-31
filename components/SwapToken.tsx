import { Button, Loading, Spacer, Spinner, Tooltip } from '@geist-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { getGradients } from '../helpers/getGradients';
import styles from '../styles/swap.module.css';
import { CoinPriceUSD } from './CoinPriceUSD';
import { useDebounce } from '../hooks/useDebounce';
import { safeParseUnits } from '../helpers/safeParseUnits';
import { Check } from '@geist-ui/react-icons';

const loadedImages: {
	[key: string]: boolean;
} = {};
export const SwapToken = (props: {
	token: OneInchGraph.Token;
	quantity: string;
	setQuantity?: Function;
	readonly?: boolean;
	onClickToChangeToken: Function;
	loading?: boolean;
	walletBalance?: string;
}) => {
	const [localQuantity, setLocalQuantity, immediateLocalQuantity] = useDebounce<
		string | number
	>(props.quantity, 450);
	const [imageLoadError, setImageLoadError] = useState(null);
	const [imageLoadedState, setImageLoaded] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	let imageLoaded = imageLoadedState || loadedImages[imageUrl];
	useEffect(() => {
		if (props.setQuantity) props.setQuantity(localQuantity);
	}, [localQuantity]);
	useEffect(() => {
		if (props.quantity != localQuantity) setLocalQuantity(props.quantity);
	}, [props.quantity]);
	useEffect(() => {
		setImageLoadError(null);
		setImageLoaded(false);
		setImageUrl(
			props.token
				? `https://tokens.1inch.exchange/${
						props.token?.symbol == 'ETH'
							? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
							: props.token?.id
				  }.png`
				: null
		);
	}, [props.token]);

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
					<div
						onClick={() => props.onClickToChangeToken()}
						className={styles.swap_form_token_select_icon}
					>
						{props.token ? (
							<>
								<img
									style={{
										...(!imageLoaded
											? {
													position: 'absolute',
													opacity: 0,
											  }
											: {}),
										display: !imageLoaded ? 'none' : 'block',
									}}
									src={imageUrl}
									onLoad={(e) => {
										setImageLoaded(true);
										loadedImages[imageUrl] = true;
									}}
									onError={(e) => setImageLoadError(e)}
									alt={props.token.symbol}
									className={styles.swap_form_token_select_icon_image}
								/>
								{!imageLoaded && !imageLoadError ? (
									<Spinner
										className={styles.swap_form_token_select_icon_image}
									></Spinner>
								) : null}
								{imageLoadError ? (
									<div>
										<div
											style={{
												transition: 'all 1s ease',
												background: getGradients().random(),
												borderRadius: '100%',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
											className={styles.swap_form_token_select_icon_image}
										>
											<b style={{ color: 'white' }}>
												{props.token.symbol.slice(0, 1)}
											</b>
										</div>
									</div>
								) : null}
							</>
						) : (
							<Spinner
								className={styles.swap_form_token_select_icon_image}
							></Spinner>
						)}
						<div className={styles.swap_form_token_select_icon_chevron_down}>
							<DropDownIcon></DropDownIcon>
						</div>
					</div>
				</div>
				<div className={styles.swap_form_token_amount_input_container}>
					<Tooltip
						style={{ width: '100%' }}
						text={
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								{props.walletBalance ? (
									<>
										<small
											style={{
												display: 'block',
												maxWidth: '70%',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
											title={props.walletBalance}
										>
											<code>{props.walletBalance}</code>
										</small>
										<Spacer x={0.8}></Spacer>
										<Button
											onClick={() => setLocalQuantity(props.walletBalance)}
											size='mini'
											type='secondary'
											ghost={props.walletBalance == immediateLocalQuantity}
										>
											{props.walletBalance == immediateLocalQuantity ? (
												<Check></Check>
											) : (
												'Max'
											)}
										</Button>
									</>
								) : (
									<small>
										<code>no balance</code>
									</small>
								)}
							</div>
						}
						placement='bottom'
					>
						<input
							autoFocus={!props.readonly}
							min='0'
							max={props.walletBalance || Infinity}
							readOnly={props.readonly}
							value={immediateLocalQuantity || ''}
							step={'0.'.padEnd(props.token?.decimals - 1) + '1'}
							onChange={(e) => {
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
					</Tooltip>
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
