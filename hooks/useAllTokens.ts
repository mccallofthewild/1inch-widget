import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { gql } from '../helpers/gql';
import { loadAllTokens } from '../loaders/loadAllTokens';
import { Store } from '../store/Store';
import { useCachedState } from './useCachedState';

let complete = false;

export const useAllTokens = (preLoaded?: OneInchGraph.Token[]) => {
	const store = Store.useContext();
	// let didUnmount = false;
	// useEffect(() => {
	// 	if (store.state.data.allTokens.length) return;
	// 	loadAllTokens({
	// 		onUpdate(tokens) {
	// 			if (!didUnmount) {
	// 				store.dispatch('SetAllTokens', [...tokens]);
	// 			}
	// 		},
	// 	});
	// 	return () => {
	// 		didUnmount = true;
	// 	};
	// }, []);
	return store.state.data.allTokens;
};
