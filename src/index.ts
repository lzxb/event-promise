export interface EventPromiseOptions {
	timeout: number;
	maxCall: number;
}

export default class EventPromise {
	public options: EventPromiseOptions;
	private _value?: any;
	private _promise?: any;
	private _timeout?: any;
	private __emit?: any;
	private _curCallCount?: any;
	public constructor(options: Partial<EventPromiseOptions> = {}) {
		this.options = {
			timeout: options.timeout || 1000,
			maxCall: options.maxCall || 100
		};
		this._emit(false);
	}
	private _emit(status: boolean, value: any = null) {
		this._value = value;
		if (this.__emit) {
			// 如果已经存在等待的 Promise，直接直接结束
			if (status === true) {
				return this.__emit();
			}
			return;
		}
		this._promise = new Promise<void>((resolve) => {
			this.__emit = () => {
				clearTimeout(this._timeout);
				this.__emit = null;
				this._curCallCount = 0;
				resolve();
			};
			this._curCallCount = 0;
		});
		if (status === true) {
			return this.__emit();
		}
		if (this.options.timeout < 1) return;
		this._timeout = setTimeout(() => {
			this.__emit();
		}, this.options.timeout);
	}
	public emitSuccess(value?: any) {
		this._emit(true, value);
	}
	public emitError(value: any) {
		this._emit(false, value);
	}
	awaitPromise() {
		if (this.__emit) {
			this._curCallCount++;
			if (this._curCallCount >= this.options.maxCall) {
				this.__emit();
			}
		}
		return this._promise.then(() => this._value);
	}
}
