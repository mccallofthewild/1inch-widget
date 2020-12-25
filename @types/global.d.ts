import * as fetch from 'cross-fetch';

declare global {
	export type GlobalFetch = typeof fetch;
}
