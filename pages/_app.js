import '../styles/global.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

export default function App({ Component, pageProps }) {
	return (
		<Web3ReactProvider
			getLibrary={() => new ethers.providers.getDefaultProvider()}
		>
			<Component {...pageProps} />
		</Web3ReactProvider>
	);
}
