import { useEffect, useState } from 'react';
import { OneInchGraph } from '../generated/OneInchGraph';
import { gql } from '../helpers/gql';
import { loadAllTokens } from '../loaders/loadAllTokens';
import { Store } from '../contexts/Store';

let complete = false;

export const useAllTokens = (preLoaded?: OneInchGraph.Token[]) => {
	const store = Store.useContext();
	return store.state.data.allTokens;
};
