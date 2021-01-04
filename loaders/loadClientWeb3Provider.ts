import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

export let loadClientWeb3Provider = async () => {
	try {
		const connector = new InjectedConnector({
			supportedChainIds: [
				1, // Mainnet
			],
		});

		let provider = new ethers.providers.Web3Provider(
			await connector.getProvider()
		);
		localStorage.setItem('didActivateWeb3', '1');
		loadClientWeb3Provider = () => Promise.resolve(provider);
		return provider;
	} catch (e) {
		console.error(e);
	}
	return null;
};
