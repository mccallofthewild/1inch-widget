import '../styles/global.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { useInfuraProvider } from '../hooks/useInfuraProvider';
import { GeistProvider } from '@geist-ui/react';
import { Store } from '../store/Store';

export default function App({ Component, pageProps }) {
	const provider = useInfuraProvider();
	return (
		<Store.Provider>
			<GeistProvider>
				<Web3ReactProvider getLibrary={() => provider}>
					<Component {...pageProps} />
				</Web3ReactProvider>
			</GeistProvider>
		</Store.Provider>
	);
}
