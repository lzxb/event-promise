## EventPromise

## 安装
```base
npm install e-promise
# or
yarn add e-promise
```

## 它可以做什么？

## 例子

## options
- options.timeout
    - 在异常的状态下，Promise超时时间，将会直接结束Promise，返回响应结果
    - default: 100ms
- options.maxCall
    - eventPromise.awaitPromise();  在异常的状态下，超过最大的调用次数，将会直接结束Promise，返回响应结果
    - defalut: 100

## API
- eventPromise.emit(status: boolean, value: any = null);
    - status = true 的情况下，任何时候都会直接响应 Promise
    - status = false 的情况下，将会等待 options.timeout 或 options.maxCall 触发的时候结束 Promise
    - value Promise 的返回值

- eventPromise.emitSuccess(value?: any);
    - 等同于 eventPromise.emit(true, value);

- eventPromise.emitError(value?: any);
    - 等同于 eventPromise.emit(false, false);

