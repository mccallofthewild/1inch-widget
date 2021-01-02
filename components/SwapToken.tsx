import { Button, Loading, Spacer, Spinner, Tooltip } from '@geist-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { getGradients } from '../helpers/getGradients';
import styles from '../styles/swap.module.css';
import { CoinPriceUSD } from './CoinPriceUSD';
import { useDebounce } from '../hooks/useDebounce';
import { safeParseUnits } from '../helpers/safeParseUnits';
import { Check } from '@geist-ui/react-icons';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { Store } from '../store/Store';
import { LoadingText } from './LoadingText';

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
	hasBalance: boolean;
	isStatic?: boolean;
}) => {
	const store = Store.useContext();
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
		setImageUrl(props.token ? getTokenImageUrl(props.token) : null);
	}, [props.token]);
	const gradient = useMemo(() => getGradients().random(), [props.token]);
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
						onClick={() => {
							if (props.isStatic) return;
							props.onClickToChangeToken();
						}}
						className={styles.swap_form_token_select_icon}
					>
						{props.token ? (
							<>
								<img
									onLoadStart={() => {
										setImageLoadError(null);
										setImageLoaded(false);
									}}
									style={{
										...(!imageLoaded
											? {
													position: 'absolute',
													opacity: 0,
											  }
											: {}),
										display: !imageLoaded ? 'none' : 'block',
									}}
									src={
										store.state.ui.preloadedDataImageUris[imageUrl] || imageUrl
									}
									onLoad={(e) => {
										setImageLoaded(true);
										loadedImages[imageUrl] = true;
									}}
									onError={(e) => setImageLoadError('error')}
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
												background: gradient,
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
						<div
							style={{
								opacity: props.isStatic ? 0 : 1,
							}}
							className={styles.swap_form_token_select_icon_chevron_down}
						>
							<DropDownIcon></DropDownIcon>
						</div>
					</div>
				</div>
				<div className={styles.swap_form_token_amount_input_container}>
					<input
						required={!props.readonly}
						autoFocus={!props.readonly}
						min='0'
						max={props.walletBalance || Infinity}
						readOnly={props.readonly}
						value={immediateLocalQuantity || ''}
						step={'any'}
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
					{!props.readonly ? (
						<div
							style={{
								marginBottom: '-1em',
								textAlign: 'center',
								opacity: props.hasBalance ? 1 : 0,
								...(props.hasBalance &&
								props.walletBalance < immediateLocalQuantity
									? { color: 'red' }
									: {}),
							}}
							className={styles.swap__input_descriptor_text}
						>
							/{' '}
							<LoadingText
								loading={!props.walletBalance && props.hasBalance}
								text={
									<span>
										{props.walletBalance?.slice(0, 10)}… (
										{props.walletBalance == immediateLocalQuantity ? (
											<span
												style={{
													transform: 'translateY(4px)',
													display: 'inline-block',
												}}
											>
												<Check size={15}></Check>
											</span>
										) : (
											<u
												onClick={() => setLocalQuantity(props.walletBalance)}
												style={{ cursor: 'pointer' }}
											>
												MAX
											</u>
										)}
										)
									</span>
								}
							></LoadingText>
						</div>
					) : null}
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
