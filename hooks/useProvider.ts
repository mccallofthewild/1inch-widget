import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { loadClientWeb3Provider } from '../loaders/loadClientWeb3Provider';

export const useProvider = () => {
	const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
	useEffect(() => {
		loadClientWeb3Provider().then((p) => setProvider(p));
	}, []);
	return provider;
};
