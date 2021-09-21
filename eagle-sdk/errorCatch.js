let formatError = (errObj) => {
  // debugger
  let col = errObj.column || errObj.columnNumber; // Safari Firefox
  let row = errObj.line || errObj.lineNumber; // Safari Firefox
  let message = errObj.message;
  let name = errObj.name; // 错误类型 比如: ReferenceError
  // sourceUrl 内容不准确，因为带你有压缩，合并， stack 中的比较靠谱

  let {stack} = errObj;
  if (stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/);
    let urlFirstStack = matchUrl ? matchUrl[0] : '';
    let regUrlCheck = /https?:\/\/(\S)*\.js/; // 此处可能有多种类型的文件，.js 只是其中一种

    let resourceUrl = '';
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];
    }

    let stackCol = null;
    let stackRow = null;
    // at http://localhost:3003/script/main.js:50:1 在栈结构中拆解，获取行列信息
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack;
    }

    // TODO formatStack
    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      message, name, resourceUrl
    };
  }

  return {
    row, col, message, name
  }
};

/**
 * 错误上报注意事项
 * mdn文档说明 https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror
 * 实际情况中，上线代码都会有压缩，因此，需要获取解压缩后的代码信息，即对应map文件中的信息
 * 特别注意各个浏览器的差异
*/
let errorCatch = {
  init: (cb) => {
    let _originOnerror = window.onerror;

    // TODO 防止自身代码发生错误，应该使用try catch 容错处理的
    window.onerror = (...arg) => {
      let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
      // debugger
      // console.log(arg, 'cuowu');
      let errorInfo = formatError(errorObj);
      errorInfo._errorMessage = errorMessage;
      errorInfo._scriptURI = scriptURI;
      errorInfo._lineNumber = lineNumber;
      errorInfo._columnNumber = columnNumber;
      errorInfo.type = 'onerror';
      cb(errorInfo);
      _originOnerror && _originOnerror.apply(window, arg);
    };

    // 捕获 promise 错误的方法
    let _originOnunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = (...arg) => {
      let e = arg[0];
      let reason = e.reason;
      cb({
        type: e.type || 'unhandledrejection',
        reason
      });
      _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg);
    };
  },
};

export default errorCatch;
