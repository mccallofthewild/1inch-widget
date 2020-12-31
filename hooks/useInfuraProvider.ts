import { ethers } from 'ethers';

let provider = new ethers.providers.InfuraProvider(
	undefined,
	'08cc738fa398476295d9fae006afed7c'
);
export const useInfuraProvider = () => provider;
