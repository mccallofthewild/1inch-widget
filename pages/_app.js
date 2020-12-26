import '../styles/global.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
// import { GeistProvider, CssBaseline } from '@geist-ui/react';

export default function App({ Component, pageProps }) {
	return (
		<Web3ReactProvider
			getLibrary={() =>
				new ethers.providers.InfuraProvider(
					undefined,
					'08cc738fa398476295d9fae006afed7c'
				)
			}
		>
			<Component {...pageProps} />
		</Web3ReactProvider>
	);
}
