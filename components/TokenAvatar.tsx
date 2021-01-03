import { Spinner } from '@geist-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { getGradients } from '../helpers/getGradients';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { Store } from '../store/Store';

const loadedImages: {
	[key: string]: boolean;
} = {};
export const TokenAvatar = (props: {
	size: number;
	token: OneInchGraph.Token;
}) => {
	const store = Store.useContext();

	const [imageLoadError, setImageLoadError] = useState(null);
	const [imageLoadedState, setImageLoaded] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	let imageLoaded = imageLoadedState || loadedImages[imageUrl];

	useEffect(() => {
		setImageLoadError(null);
		setImageLoaded(false);
		setImageUrl(props.token ? getTokenImageUrl(props.token) : null);
	}, [props.token]);

	const gradient = useMemo(() => getGradients().random(), [props.token]);

	return props.token ? (
		<>
			<img
				onLoadStart={() => {
					setImageLoadError(null);
					setImageLoaded(false);
				}}
				style={{
					transition: 'all 1s ease',
					display: !imageLoaded ? 'none' : 'block',
					width: props.size,
					height: props.size,
				}}
				src={store.state.ui.preloadedDataImageUris[imageUrl] || imageUrl}
				onLoad={(e) => {
					setImageLoaded(true);
					loadedImages[imageUrl] = true;
				}}
				onError={(e) => setImageLoadError('error')}
				alt={props.token.symbol}
			/>
			{!imageLoaded && !imageLoadError ? (
				<Spinner style={{ width: props.size, height: props.size }}></Spinner>
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
							width: props.size,
							height: props.size,
						}}
					>
						<b
							style={{
								color: 'white',
								fontSize: props.size / 1.5,
								display: 'block',
							}}
						>
							{props.token.symbol.slice(0, 1)}
						</b>
					</div>
				</div>
			) : null}
		</>
	) : (
		<Spinner style={{ width: props.size, height: props.size }}></Spinner>
	);
};
