import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import { Swap } from '../components/Swap';
import { OneInchGraph } from '../generated/OneInchGraph';
import { convertImageUrlToDataUri } from '../helpers/convertImageUrlToDataUri';
import { getTokenImageUrl } from '../helpers/getTokenImageUrl';
import { loadAllTokens } from '../loaders/loadAllTokens';
import { Store } from '../store/Store';
import { useRouter } from 'next/router';
export type WidgetProps = {
	allTokens: OneInchGraph.Token[];
	preloadedTokenImageDataUris?: Record<string, string>;
};
const widget = (props: WidgetProps) => {
	if (process.browser) {
		// injects parent window's web3 into iframe. Required for mobile browsers
		// @ts-ignore
		window.ethereum = window.ethereum || parent.window.ethereum;
	}
	const router = useRouter();
	const store = Store.useContext();
	useEffect(() => {
		if (props.preloadedTokenImageDataUris) {
			for (let imageUrl in props.preloadedTokenImageDataUris) {
				store.dispatch('AddPreloadedDataImageUri', {
					url: imageUrl,
					dataURI: props.preloadedTokenImageDataUris[imageUrl],
				});
			}
		}
		if (props.allTokens) {
			store.dispatch('SetAllTokens', props.allTokens);
		}
	}, []);
	let staticToTokenSymbol = router.query.toToken;
	return (
		<Swap
			staticToTokenSymbol={staticToTokenSymbol as string}
			allTokens={props.allTokens}
		></Swap>
	);
};
export default widget;
export const getStaticProps: GetStaticProps<WidgetProps> = async ({
	params,
}) => {
	const fs = require('fs');
	let allTokens;
	if (fs.existsSync('/tmp/allTokens.json')) {
		allTokens = JSON.parse(fs.readFileSync('/tmp/allTokens.json').toString());
	} else {
		allTokens = await loadAllTokens();
		fs.writeFileSync('/tmp/allTokens.json', JSON.stringify(allTokens));
	}
	const preloadedTokenImageDataUris = {};
	for (const token of allTokens.slice(0, 2)) {
		const imageUrl = getTokenImageUrl(token);
		const res = await fetch(imageUrl);
		const data = await res.arrayBuffer();
		const base64 = new Buffer(data).toString('base64');
		preloadedTokenImageDataUris[imageUrl] = `data:;base64,${base64}`;
		// preloadedTokenImageDataUris[token.id] = await convertImageUrlToDataUri(
		// 	getTokenImageUrl(token)
		// );
	}
	// Pass post data to the page via props
	return { props: { allTokens, preloadedTokenImageDataUris } };
};
