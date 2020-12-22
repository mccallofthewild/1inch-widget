import fetch from 'cross-fetch';
import { OneInchGraph } from '../generated/OneInchGraph';

function createInvocablePromise<
	PromiseReturnType,
	FunctionType extends Function = Function
>(
	fn: FunctionType,
	promiseCb: ConstructorParameters<typeof Promise>[0]
): Promise<PromiseReturnType> & FunctionType {
	const promiseDescriptors = Object.getOwnPropertyDescriptors(
		Promise.prototype
	);
	const promiseInstance = new Promise(promiseCb);
	for (let thing in promiseDescriptors) {
		promiseDescriptors[thing].value = promiseDescriptors[thing].value.bind(
			promiseInstance
		);
	}
	Object.defineProperties(fn, promiseDescriptors);
	return (fn as unknown) as Promise<PromiseReturnType> & FunctionType;
}

export const gql = (...templateLiteral: Parameters<typeof String.raw>) => {
	const query = String.raw(...templateLiteral);
	let variables;
	const request = (): Promise<GqlTypes.Query> =>
		fetch(
			'https://api.thegraph.com/subgraphs/name/1inch-exchange/one-inch-v2',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					query,
					...(variables ? { variables } : {}),
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				if (r.data) return r.data;
				if (r.errors) throw r.errors;
				return r;
			});
	return createInvocablePromise<
		OneInchGraph.Query,
		(vars: object) => Promise<OneInchGraph.Query>
	>(
		(vars) => {
			variables = vars;
			return request();
		},
		(resolve, reject) => {
			const timeout = setTimeout(() => {
				if (variables) return resolve(true);
				return resolve(request());
			}, 0);
		}
	);
};
(async () => {
	return;
	const thing = await gql`
		{
			pairs(first: 1, skip: 10) {
				token0 {
					name
				}
				token1 {
					name
				}
				token0Price
				token1Price
			}
		}
	`;
	console.log(thing);

	console.log('-----');

	const thing2 = await gql`
		query PairRequest($first: Int!) {
			pairs(first: $first, skip: 10) {
				token0 {
					name
				}
				token1 {
					name
				}
				token0Price
				token1Price
			}
		}
	`({
		first: 2,
	});

	console.log(thing2);
})();
