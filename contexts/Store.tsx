import React, { useReducer, createContext, useContext } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import produce from 'immer';
import { LiteralUnion } from 'type-fest';
type State = {
	data: {
		allTokens: OneInchGraph.Token[];
		walletsBalances: {
			[walletAddress: string]: {
				[contractAddress: string]: string;
			};
		};
	};
	ui: {
		preloadedDataImageUris: Record<string, string>;
	};
};

const initialState: State = {
	data: { allTokens: [], walletsBalances: {} },
	ui: {
		preloadedDataImageUris: {},
	},
};

type Actions =
	| ['AddPreloadedDataImageUri', { url: string; dataURI: string }]
	| ['SetAllTokens', OneInchGraph.Token[]]
	| ['Init', null]
	| [
			'SetTokenBalanceForWallet',
			{
				walletAddress: string;
				tokenContractAddress: string;
				formattedBalance: string;
			}
	  ];

const reducer = produce((state: State, action: Actions) => {
	switch (action[0]) {
		case 'SetAllTokens':
			state.data.allTokens = action[1];
			break;
		case 'AddPreloadedDataImageUri':
			state.ui.preloadedDataImageUris[action[1].url] = action[1].dataURI;
			break;
		case 'SetTokenBalanceForWallet':
			const val = state.data.walletsBalances[action[1].walletAddress];
			state.data.walletsBalances[action[1].walletAddress] = {
				...(val || {}),
				[action[1].tokenContractAddress]: action[1].formattedBalance,
			};
			break;
		default:
			throw new Error();
	}
}, initialState);

const getReducerHook = () => useReducer(reducer, initialState);

const StoreContext = createContext<ReturnType<typeof getReducerHook>>([
	{} as State,
	() => {},
]);
export const Store = {
	useContext: () => {
		const [state, dispatch] = useContext(StoreContext);
		type A = Actions;
		return {
			state,
			dispatch: (...args: Actions) => dispatch(args),
		};
	},
	Context: StoreContext,
	Provider: (props) => {
		const [state, dispatch] = getReducerHook();
		return (
			<StoreContext.Provider value={[state, dispatch]}>
				{props.children}
			</StoreContext.Provider>
		);
	},
};
