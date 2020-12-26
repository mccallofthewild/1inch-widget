import styles from '../styles/swap.module.css';
export const Swap = () => {
	return (
		<div className={styles.swap_container}>
			<div className={styles.swap_header}>
				<div
					className={[
						styles.swap_header_item,
						styles.swap_header_item_active,
					].join(' ')}
				>
					SWAP
				</div>
				<div className={styles.swap_header_item}>INFO</div>
			</div>
			<div className={styles.swap_form_container}>
				<Swap.Token></Swap.Token>
				<div className={styles.swap_form_token_divider_container}>
					<div className={styles.swap_form_token_divider}></div>
					<div className={styles.swap_form_token_divider_action_icon}>
						{/* Refresh Icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							height='24'
							viewBox='0 0 24 24'
							width='24'
						>
							<path d='M0 0h24v24H0z' fill='none' />
							<path d='M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z' />
						</svg>
					</div>
				</div>
				<Swap.Token></Swap.Token>
				<div className={styles.swap_form_token_dex_info_container}>
					<div className={styles.swap_form_token_dex_info_title}>
						Spread across DEXes
					</div>
					<div className={styles.swap_form_token_dex_info_toggle}>
						<div className={styles.swap_form_token_dex_info_toggle_action_text}>
							6 Selected
						</div>
						<DropDownIcon></DropDownIcon>
					</div>
				</div>
				<button className={styles.swap_form_submit_button}>Swap Now</button>
				<div className={styles.swap_form_meta_container}>
					<div>Max price slippage: 1%</div>
					<div>Gas price: 164 GWEI</div>
				</div>
			</div>
		</div>
	);
};

Swap.Token = () => {
	return (
		<div className={styles.swap_form_token_container}>
			<div className={styles.swap_form_token_label}>DAI</div>
			<div className={styles.swap_form_token_select_container}>
				<div className={styles.swap_form_token_select}>
					<div className={styles.swap_form_token_select_icon}>
						<img
							src='https://tokens.1inch.exchange/0x6b175474e89094c44da98b954eedeac495271d0f.png'
							alt='DAI'
							className={styles.swap_form_token_select_icon_image}
						/>
						<div className={styles.swap_form_token_select_icon_chevron_down}>
							<DropDownIcon></DropDownIcon>
						</div>
					</div>
				</div>

				<div className={styles.swap_form_token_amount_input_container}>
					<input
						type='number'
						placeholder='1.32009'
						className={styles.swap_form_token_amount_input}
					></input>
				</div>
				<div className={styles.swap_form_token_amount_in_fiat_container}>
					<div className={styles.swap_form_token_amount_in_fiat}>≈$0.30</div>
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
