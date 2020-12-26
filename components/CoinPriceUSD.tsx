import { Loading, Row, Spinner } from '@geist-ui/react';
import { useEffect, useState } from 'react';
import { OneInchApi } from '../generated/OneInchApi';
import { calc } from '../helpers/calc';
export const CoinPriceUSD = (props: {
	stableCoinAddress: string;
	tokenAddress: string;
	tokenQuantity: string;
}) => {
	const [price, setPrice] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setPrice('');
		if (!props.tokenAddress || !props.stableCoinAddress) return;
		if (props.stableCoinAddress == props.tokenAddress) {
			setPrice('1.00');
		}
		// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMarketpairsLatest
		new OneInchApi.QuoteSwapApi()
			.getQuote({
				toTokenAddress: props.stableCoinAddress,
				fromTokenAddress: props.tokenAddress,
				amount: 1,
			})
			.then((q) => setPrice(calc`${q.toTokenAmount} * ${props.tokenQuantity}`));
	}, [props.tokenAddress, props.tokenAddress, props.tokenQuantity]);
	return (
		<Row>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span>≈ $</span>
				{price ? price : <Spinner size='small' />}
			</div>
		</Row>
	);
};
