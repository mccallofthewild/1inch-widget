import { CoinPriceUSD } from '../components/CoinPriceUSD';
import { Swap } from '../components/Swap';
import { TokenSearch } from '../components/TokenSearch';
import { useAllTokens } from '../hooks/useAllTokens';

export default function components() {
	return (
		<div
			style={{
				marginTop: 20,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ width: 400 }}>
				<TokenSearch></TokenSearch>
				<Swap></Swap>
			</div>
			<h2>One Token</h2>
			<CoinPriceUSD
				tokenAddress='0x0000000000000000000000000000000000000000'
				stableCoinAddress='0x6b175474e89094c44da98b954eedeac495271d0f'
				tokenQuantity='1'
			></CoinPriceUSD>
			<h2>5 Tokens</h2>
			<CoinPriceUSD
				tokenAddress='0x0000000000000000000000000000000000000000'
				stableCoinAddress='0x6b175474e89094c44da98b954eedeac495271d0f'
				tokenQuantity='5'
			></CoinPriceUSD>
		</div>
	);
}
