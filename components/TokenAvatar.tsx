import { Spinner } from '@geist-ui/react';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { getGradients } from '../helpers/getGradients';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { Store } from '../contexts/Store';
import React from 'react';

const loadedImages: {
	[key: string]: boolean;
} = {};

const imageLoadErrors: {
	[key: string]: any;
} = {};
const imageGradients: { [key: string]: string } = {};
type PropType = {
	size: number;
	token: OneInchGraph.Token;
	style?: CSSProperties;
};

export const TokenAvatar = React.forwardRef<HTMLImageElement, PropType>(
	function TokenAvatarRaw(props: PropType, ref) {
		const store = Store.useContext();
		const [imageUrl, setImageUrl] = useState('');
		const [imageLoadError, setImageLoadError] = useState(null);
		const [imageLoadedState, setImageLoaded] = useState(false);
		let imageLoaded = imageLoadedState || loadedImages[imageUrl];

		useEffect(() => {
			const url = props.token ? getTokenImageUrl(props.token) : null;
			setImageLoadError(imageLoadErrors[url]);
			setImageLoaded(false);
			setImageUrl(url);
		}, [props.token]);

		const gradient = useMemo(() => {
			const g = imageGradients[imageUrl] || getGradients().random();
			imageGradients[imageUrl] = g;
			return g;
		}, [props.token, imageUrl]);

		return props.token ? (
			<>
				<img
					ref={ref}
					onLoadStart={() => {
						setImageLoadError(null);
						setImageLoaded(false);
					}}
					style={{
						transition: 'all 1s ease',
						display: !imageLoaded ? 'none' : 'block',
						width: props.size,
						height: props.size,
						...(props.style || {}),
					}}
					src={store.state.ui.preloadedDataImageUris[imageUrl] || imageUrl}
					onLoad={(e) => {
						setImageLoaded(true);
						loadedImages[imageUrl] = true;
					}}
					onError={(e) => {
						setImageLoadError('error');
						imageLoadErrors[imageUrl] = true;
					}}
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
	}
);
