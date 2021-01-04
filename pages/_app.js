import '../styles/global.css';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { useInfuraProvider } from '../hooks/useInfuraProvider';
import { GeistProvider } from '@geist-ui/react';
import { Store } from '../contexts/Store';
import * as _react from 'react';

const shouldLogUseEffect = false;
if (shouldLogUseEffect) {
	const fn = _react.useEffect;
	_react.useEffect = function (fn2, ...args) {
		return fn(() => {
			console.log(...args);
			return fn2();
		}, ...args);
	};
}

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
