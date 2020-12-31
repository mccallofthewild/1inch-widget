import { setTimeout } from 'timers';
import { RateLimitProtector } from '../utils/RateLimitProtector';

export const addRateLimitProtector = (fn, msBetweenCalls) => {
	return new RateLimitProtector({ padding: msBetweenCalls }).buildAsyncShield(
		fn,
		fn
	);
};
