import '../styles/global.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { useInfuraProvider } from '../hooks/useInfuraProvider';
import { GeistProvider, CssBaseline } from '@geist-ui/react';

export default function App({ Component, pageProps }) {
	const provider = useInfuraProvider();
	return (
		<GeistProvider>
			<Web3ReactProvider getLibrary={() => provider}>
				<Component {...pageProps} />
			</Web3ReactProvider>
		</GeistProvider>
	);
}
