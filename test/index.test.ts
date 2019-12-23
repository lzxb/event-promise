import EventPromise from '../src';

describe('Base test', () => {
	it('Success return value', async () => {
		const my = new EventPromise();
		my.emitSuccess(100);
		const res = await my.awaitPromise();
		expect(res).toEqual(100);
	});

	it('Error return value', async () => {
		const my = new EventPromise({
			timeout: 10
		});
		my.emitError(100);
		setTimeout(() => {
			my.emitSuccess(-100);
		});
		const res = await my.awaitPromise();
		expect(res).toEqual(-100);
	});

	it('Timeout', async () => {
		const my = new EventPromise({
			timeout: 10
		});
		my.emitError(100);
		const res = await my.awaitPromise();
		expect(res).toEqual(100);
	});

	it('Exceeding the limit in default', async () => {
		const my = new EventPromise({
			maxCall: 3
		});
		const arr: any[] = [];
		for (let i = 0; i < 3; i++) {
			arr.push(await my.awaitPromise());
		}
		expect(arr).toEqual([null, null, null]);
	});

	it('Exceeding the limit', async () => {
		const my = new EventPromise({
			maxCall: 3
		});
		my.emitError('error');
		const arr: any[] = [];
		for (let i = 0; i < 3; i++) {
			arr.push(await my.awaitPromise());
		}
		expect(arr).toEqual(['error', 'error', 'error']);
	});

	it('Multiple calls', async () => {
		const my = new EventPromise({
			maxCall: 3
		});
		my.emitError(100);
		expect(await my.awaitPromise()).toEqual(100);
		my.emitSuccess(101);
		expect(await my.awaitPromise()).toEqual(101);
	});
});
