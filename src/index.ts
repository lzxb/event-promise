export interface EventPromiseOptions {
	timeout: number;
	maxCall: number;
}

export default class EventPromise {
	public options: EventPromiseOptions;
	private _value?: any;
	private _promise?: any;
	private _timeout?: any;
	private _emit?: any;
	private _curCallCount?: any;
	public constructor(options: Partial<EventPromiseOptions> = {}) {
		this.options = { timeout: 1000, maxCall: 100, ...options };
		this.emit(false);
	}
	public emit(status: boolean, value: any = null) {
		this._value = value;
		if (this._emit) {
			// 如果已经存在等待的 Promise，直接直接结束
			if (status === true) {
				return this._emit();
			}
			return;
		}
		this._promise = new Promise((resolve) => {
			this._emit = () => {
				clearTimeout(this._timeout);
				this._emit = null;
				this._curCallCount = 0;
				resolve();
			};
			this._curCallCount = 0;
		});
		if (status === true) {
			return this._emit();
		}
		if (this.options.timeout < 1) return;
		this._timeout = setTimeout(() => {
			this._emit();
		}, this.options.timeout);
	}
	public emitSuccess(value?: any) {
		this.emit(true, value);
	}
	public emitError(value: any) {
		this.emit(false, value);
	}
	awaitPromise() {
		if (this._emit) {
			this._curCallCount++;
			if (this._curCallCount >= this.options.maxCall) {
				this._emit();
			}
		}
		return this._promise.then(() => this._value);
	}
}
