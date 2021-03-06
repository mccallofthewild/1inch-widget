export class RateLimitProtector {
	lastInvokation: number = 0;
	backOfLine: Promise<any> = Promise.resolve();
	padding: number;

	static create(...args: ConstructorParameters<typeof RateLimitProtector>) {
		return new this(...args);
	}
	constructor({ padding }) {
		this.padding = padding;
	}

	get waitTime() {
		let time = Date.now();
		let timeWhenSafeToCall = this.lastInvokation + this.padding;
		let timeToWait = Math.max(timeWhenSafeToCall - time, 0);
		return timeToWait;
	}

	shieldAll(obj, context) {
		for (let prop in obj) {
			let item = obj[prop];
			if (item instanceof Function) {
				try {
					obj[prop] = this.buildAsyncShield(item, context);
				} catch (e) {}
			}
		}
	}

	buildAsyncShield(fn, context) {
		let self = this;
		if (context != undefined) {
			fn = fn.bind(context);
		}
		let shieldFn = async (...args) => {
			let shieldPromiseToWaitFor = this.backOfLine;
			let resolver;
			this.backOfLine = new Promise((_resolve) => {
				resolver = _resolve;
			});
			// await shieldPromiseToWaitFor;
			let waitTime = self.waitTime;
			if (waitTime) {
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
			resolver();
			self.lastInvokation = Date.now();
			return fn(...args);
		};
		let shield = {
			async [fn.name](...args) {
				return shieldFn(...args);
			},
		}[fn.name];
		return shield;
	}
}
