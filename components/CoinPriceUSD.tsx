import { Loading } from '@geist-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { abbreviateNumber } from '../helpers/abbreviateNumber';
import { useAllTokens } from '../hooks/useAllTokens';
import { useCoinPriceUSD } from '../hooks/useCoinPriceUSD';
import { useQuote } from '../hooks/useQuote';
export const CoinPriceUSD = (props: {
	token: OneInchGraph.Token;
	tokenQuantity: string;
	prefix?: string;
	isReady?: boolean;
}) => {
	let price = useCoinPriceUSD(props);
	price = useMemo(() => (price ? abbreviateNumber(price) : ''), [price]);
	return price ? (
		<>
			{props.prefix}${price}
		</>
	) : (
		<span
			style={{
				width: '20px',
				height: '8px',
				display: 'inline-block',
				position: 'relative',
			}}
		>
			<Loading style={{ width: '1em', height: '0.5em' }}></Loading>
		</span>
	);
};
