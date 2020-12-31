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
				tokenDecimals={18}
				prefix='≅ $'
				tokenAddress='0x0000000000000000000000000000000000000000'
				tokenQuantity='1'
			></CoinPriceUSD>
			<h2>5 Tokens</h2>
			<CoinPriceUSD
				tokenDecimals={18}
				prefix='≅ $'
				tokenAddress='0x0000000000000000000000000000000000000000'
				tokenQuantity='5'
			></CoinPriceUSD>
		</div>
	);
}
