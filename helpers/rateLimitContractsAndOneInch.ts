import { ERC20, ERC20__factory } from '../generated/contracts';
import { RateLimitProtector } from '../utils/RateLimitProtector';
import * as OneInchModels from '../generated/openapi/models';
export const rateLimitContractsAndOneInch = () => {
	Object.values(OneInchModels).forEach((api) => {
		if (typeof api == 'function') {
			RateLimitProtector.create({ padding: 500 }).shieldAll(api.prototype, api);
		}
	});
	const base = ERC20__factory.connect;
	ERC20__factory.connect = (...args: Parameters<typeof base>) => {
		const result = base(...args) as ERC20;
		RateLimitProtector.create({ padding: 500 }).shieldAll(
			result.functions,
			result
		);
		return result;
	};
};
