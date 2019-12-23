## EventPromise

## 安装
```base
npm install e-promise
# or
yarn add e-promise
```

## 它可以做什么？
在 Node 中，我们经常需要连接数据库、Redis、Mq、Socket、Rpc等等，它们都是基于回调通知是否连接成功，在连接成功的时候才能进行对应的操作，EventPromise 就是专门为了解决它而存在，让你使用同步的形式调用异步的回调。

## 例子
```javascript
// 这里用 socket.io 举个例子，其它的举一反三
const EventPromise = require('e-promise');
class IoEventPromise extends EventPromise {
	constructor() {
		super({
			// 设置超时时间，如果超过为异常
			timeout: 1000,
			// 设置 awaitPromise 最大的调用次数，如果超过为异常
			maxCall: 100
		});
		const server = require('http').createServer();
		const io = require('socket.io')(server);
		io.on('connection', client => {
			client.on('disconnect', () => {
				// 连接失败
				this.emitError('disconnect');
			});
			// 连接成功
			this.emitSuccess(client);
		});
		server.listen(3000);
	}
	async emit (eventName, ...args) {
		const client = await this.awaitPromise();
		// 连接失败，则直接输出错误
		if (typeof client === 'string') {
			console.log(client);
			return;
		}
		// 连接成功，直接发送事件
		client.emit(eventName, ...args);
	}
}

const io = new IoEventPromise();
// 这里你就可以立即调用，发送事件，等 socket 连接成功后自行发送
io.emit('事件名称', '发送的参数');

```

## options
- options.timeout
    - 在异常的状态下，Promise超时时间，将会直接结束Promise，返回响应结果
    - default: 100ms
- options.maxCall
    - eventPromise.awaitPromise();  在异常的状态下，超过最大的调用次数，将会直接结束Promise，返回响应结果
    - defalut: 100

## API
- eventPromise.emit(status: boolean, value: any = null);
    - `status = true 的情况下，任何时候都会直接响应 Promise`
    - status = false 的情况下，将会等待 options.timeout 或 options.maxCall 触发的时候结束 Promise
    - value Promise 的返回值

- eventPromise.emitSuccess(value?: any);
    - 会立即响应 Promise 结果

- eventPromise.emitError(value?: any);
    - 如果在 options.timeout 和 options.maxCall 指定的限制内，没有执行 eventPromise.emitSuccess() ，将会响应本结果

- eventPromise.awaitPromise();
    - 等待 Promise 响应，并且可以拿到返回值

